import {
  get,
  insertRow,
  jsonField,
  nowSql,
  readBody,
  run,
  successRedirect,
  updateRow,
  validationError,
  type Body,
} from '../http';

/**
 * Price list admin (PriceListController::save). The whole category/row tree is
 * resynced transactionally: delete missing, update existing, create new.
 */

function isArrayLike(value: any): boolean {
  return Array.isArray(value) || (value !== null && typeof value === 'object');
}

export function priceSettingsRow(): any {
  let row = get<any>('SELECT * FROM price_settings ORDER BY id LIMIT 1');
  if (!row) {
    const now = nowSql();
    const id = insertRow('price_settings', { created_at: now, updated_at: now });
    row = get<any>('SELECT * FROM price_settings WHERE id = ?', [id]);
  }
  return row;
}

function validId(value: any): value is number {
  if (value === null || value === undefined || typeof value === 'object') return false;
  const text = String(value).trim();
  if (!/^-?\d+(\.\d+)?$/.test(text)) return false;
  return Number(text) > 0;
}

export async function handlePriceListSave(request: Request): Promise<Response> {
  const body = await readBody(request);

  const errors: Record<string, string[]> = {};
  const textFields: Array<[string, number | null]> = [
    ['pageTitle', null],
    ['meta_desc', null],
    ['canonical_url', null],
    ['schema_type', null],
    ['schema_json', null],
  ];
  for (const [field, max] of textFields) {
    const value = body[field];
    if (value !== null && value !== undefined) {
      if (typeof value === 'object') {
        errors[field] = [`The ${field.replace(/_/g, ' ')} field must be a string.`];
      } else if (max !== null && String(value).length > max) {
        errors[field] = [`The ${field.replace(/_/g, ' ')} field must not be greater than ${max} characters.`];
      }
    }
  }
  if (body.seo !== null && body.seo !== undefined) {
    if (typeof body.seo !== 'object') {
      errors['seo'] = ['The seo field must be an array.'];
    } else {
      for (const [field, max] of [['sectionTitle', 255], ['content', null]] as Array<[string, number | null]>) {
        const value = body.seo[field];
        if (value !== null && value !== undefined) {
          if (typeof value === 'object') {
            errors[`seo.${field}`] = [`The seo.${field} field must be a string.`];
          } else if (max !== null && String(value).length > max) {
            errors[`seo.${field}`] = [`The seo.${field} field must not be greater than ${max} characters.`];
          }
        }
      }
    }
  }
  for (const field of ['faqs', 'categories']) {
    if (body[field] !== null && body[field] !== undefined && !isArrayLike(body[field])) {
      errors[field] = [`The ${field} field must be an array.`];
    }
  }
  if (Object.keys(errors).length) return validationError(errors);

  const settings = priceSettingsRow();
  const seo = body.seo && typeof body.seo === 'object' ? body.seo : {};
  const data: Record<string, any> = { updated_at: nowSql() };

  const keep = (key: string, value: any) => {
    if (value === undefined || value === null) return settings[key];
    return value;
  };

  data.page_title = keep('page_title', body.pageTitle);
  data.seo_title = keep('seo_title', seo.sectionTitle);
  data.seo_content = keep('seo_content', seo.content);
  data.meta_desc = keep('meta_desc', body.meta_desc);
  data.canonical_url = keep('canonical_url', body.canonical_url);
  data.schema_type = keep('schema_type', body.schema_type);
  data.schema_json = keep('schema_json', body.schema_json);

  if ('robots_index' in body) {
    const value = body.robots_index;
    data.robots_index =
      value === true || value === 1 || value === '1' || value === 'true' || value === 'on' ? 1 : 0;
  }
  if ('robots_follow' in body) {
    const value = body.robots_follow;
    data.robots_follow =
      value === true || value === 1 || value === '1' || value === 'true' || value === 'on' ? 1 : 0;
  }

  if (body.faqs === undefined || body.faqs === null) {
    data.faqs = settings.faqs;
  } else {
    data.faqs = JSON.stringify(jsonField(body.faqs, []));
  }

  updateRow('price_settings', settings.id, data);

  const categories = body.categories;
  if (isArrayLike(categories) && categories && Object.keys(categories).length > 0) {
    run('BEGIN');
    try {
      const categoryList: any[] = Array.isArray(categories) ? categories : Object.values(categories);

      const incomingCategoryIds = categoryList
        .map((category) => (category && category.id !== undefined ? category.id : null))
        .filter((id) => validId(id))
        .map((id) => Number(id));
      if (incomingCategoryIds.length) {
        run(
          `DELETE FROM price_categories WHERE id NOT IN (${incomingCategoryIds.map(() => '?').join(', ')})`,
          incomingCategoryIds
        );
      }

      categoryList.forEach((catData: any, index: number) => {
        catData = catData && typeof catData === 'object' ? catData : {};
        let categoryId: number | null = null;

        if (validId(catData.id)) {
          const existing = get<any>('SELECT id FROM price_categories WHERE id = ?', [Number(catData.id)]);
          if (existing) {
            categoryId = Number(existing.id);
          } else {
            const now = nowSql();
            categoryId = insertRow('price_categories', {
              name: catData.name !== undefined && catData.name !== null ? String(catData.name) : 'New Category',
              sort_order: index,
              created_at: now,
              updated_at: now,
            });
          }
        } else {
          const now = nowSql();
          categoryId = insertRow('price_categories', {
            name: catData.name !== undefined && catData.name !== null ? String(catData.name) : 'New Category',
            sort_order: index,
            created_at: now,
            updated_at: now,
          });
        }

        const current = get<any>('SELECT name FROM price_categories WHERE id = ?', [categoryId]);
        updateRow('price_categories', categoryId, {
          name: catData.name !== undefined && catData.name !== null ? String(catData.name) : current?.name ?? null,
          sort_order: index,
          updated_at: nowSql(),
        });

        const treatments: any[] = Array.isArray(catData.treatments)
          ? catData.treatments
          : catData.treatments && typeof catData.treatments === 'object'
            ? Object.values(catData.treatments)
            : [];

        const incomingRowIds = treatments
          .map((row) => (row && row.id !== undefined ? row.id : null))
          .filter((id) => validId(id))
          .map((id) => Number(id));
        if (incomingRowIds.length) {
          run(
            `DELETE FROM price_rows WHERE category_id = ? AND id NOT IN (${incomingRowIds.map(() => '?').join(', ')})`,
            [categoryId, ...incomingRowIds]
          );
        }

        treatments.forEach((rowData: any, rowIndex: number) => {
          rowData = rowData && typeof rowData === 'object' ? rowData : {};
          const name =
            rowData.name !== undefined && rowData.name !== null ? String(rowData.name) : '';
          const bdt = rowData.bdt === undefined || rowData.bdt === null ? null : String(rowData.bdt);
          const usd = rowData.usd === undefined || rowData.usd === null ? null : String(rowData.usd);

          if (validId(rowData.id)) {
            const row = get<any>('SELECT id, category_id FROM price_rows WHERE id = ?', [Number(rowData.id)]);
            if (row && Number(row.category_id) === Number(categoryId)) {
              updateRow('price_rows', Number(row.id), {
                service_name: name,
                price_bdt: bdt,
                price_usd: usd,
                sort_order: rowIndex,
                updated_at: nowSql(),
              });
              return;
            }
          }

          const now = nowSql();
          insertRow('price_rows', {
            category_id: categoryId,
            service_name: name,
            price_bdt: bdt,
            price_usd: usd,
            sort_order: rowIndex,
            created_at: now,
            updated_at: now,
          });
        });
      });

      run('COMMIT');
    } catch (error) {
      try {
        run('ROLLBACK');
      } catch {
        // ignore rollback errors
      }
      throw error;
    }
  }

  return successRedirect('/price-list-admin', { message: 'Price list saved successfully!' });
}
