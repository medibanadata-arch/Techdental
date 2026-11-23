import { guardAdmin, jsonResponse, currentAdmin } from './http';
import {
  handleConfirmPassword,
  handleLogin,
  handleLogout,
  handlePasswordEmail,
  handlePasswordReset,
  handlePasswordUpdate,
  handleProfileDestroy,
  handleProfileUpdate,
  handleRegister,
  handleVerificationSend,
} from './handlers/auth';
import {
  handleCategoryDestroy,
  handleCategoryStore,
  handlePostForceDelete,
  handlePostRestore,
  handlePostStore,
  handlePostTrash,
  handlePostUpdate,
  handleTagDestroy,
  handleTagStore,
  handleUserDestroy,
  handleUserStore,
  handleUserUpdate,
} from './handlers/content';
import {
  handlePageDestroy,
  handlePageQuickDraft,
  handlePageStore,
  handlePageUpdate,
} from './handlers/pages';
import {
  handleFeaturedImageDestroy,
  handleFeaturedImageReorder,
  handleFeaturedImageStore,
  handleFeaturedImageUpdate,
} from './handlers/featuredImages';
import {
  handleDoctorDestroy,
  handleDoctorReorder,
  handleDoctorSettings,
  handleDoctorStore,
  handleDoctorUpdate,
} from './handlers/doctors';
import {
  handleTeamDestroy,
  handleTeamReorder,
  handleTeamStore,
  handleTeamToggle,
  handleTeamUpdate,
} from './handlers/team';
import {
  handleBranchDestroy,
  handleBranchReorder,
  handleBranchStore,
  handleBranchUpdate,
} from './handlers/branches';
import {
  handleServiceDestroy,
  handleServiceReorder,
  handleServiceStore,
  handleServiceUpdate,
} from './handlers/services';
import {
  handleMedicineDestroy,
  handleMedicineReorder,
  handleMedicineStore,
  handleMedicineUpdate,
} from './handlers/medicines';
import {
  handleMediaApiIndex,
  handleMediaApiUpload,
  handleMediaBulkDestroy,
  handleMediaDestroy,
  handleMediaDownload,
  handleMediaRotate,
  handleMediaStore,
  handleMediaUpdate,
} from './handlers/media';
import { handleAboutUpdate } from './handlers/about';
import { handlePriceListSave } from './handlers/pricelist';
import {
  handleHeaderFooterUpdate,
  handleSettingsUpdate,
  handleWebsiteTextsSave,
} from './handlers/settings';
import { handleMenuDestroy, handleMenuStore, handleMenuUpdate } from './handlers/menus';
import {
  handleRedirectDestroy,
  handleRedirectStore,
  handleRedirectToggle,
  handleRedirectUpdate,
} from './handlers/redirects';
import {
  handleHomepageBranchReorder,
  handleHomepageBranchUpdate,
  handleHomepageContentSave,
  handleHomepageDoctorReorder,
  handleHomepageDoctorUpdate,
  handleHomepageGalleryDestroy,
  handleHomepageGalleryReorder,
  handleHomepageGalleryStore,
  handleHomepageGalleryUpdate,
  handleHomepageServiceReorder,
  handleHomepageServiceUpdate,
  handleHomepageVideoDestroy,
  handleHomepageVideoReorder,
  handleHomepageVideoStore,
  handleHomepageVideoUpdate,
} from './handlers/homepage';
import { handleComplaintDestroy, handleComplaintUpdate } from './handlers/complaints';
import {
  handlePatientResponsibilityDestroy,
  handlePatientResponsibilityStore,
  handlePatientResponsibilityUpdate,
  handlePatientResponsibilitiesReorder,
  handlePatientRightDestroy,
  handlePatientRightStore,
  handlePatientRightUpdate,
  handlePatientRightsReorder,
  handlePatientRightsSettings,
} from './handlers/patientrights';
import {
  handleHowToPayBranches,
  handleHowToPayMethods,
  handleHowToPaySettings,
} from './handlers/howtopay';
import { handleAppointmentDestroy, handleAppointmentUpdate } from './handlers/appointments';
import {
  handleAiFetchModels,
  handleAiRuleDestroy,
  handleAiRuleStore,
  handleAiRuleToggle,
  handleAiRuleUpdate,
  handleAiSettings,
  handleAiTestGemini,
} from './handlers/ai';

/**
 * Central dispatcher for admin/auth mutations. Astro pages only handle GET, so
 * POST/PUT/PATCH/DELETE requests are matched here (called from middleware.ts).
 */

export type RouteHandler = (request: Request, match: RegExpMatchArray) => Promise<Response> | Response;

export interface AdminRoute {
  method: string;
  pattern: RegExp;
  handler: RouteHandler;
  guard: 'admin' | 'auth' | 'none';
}

export const AUTH_ROUTES: AdminRoute[] = [
  { method: 'POST', pattern: /^\/login$/, handler: (request) => handleLogin(request), guard: 'none' },
  { method: 'POST', pattern: /^\/register$/, handler: (request) => handleRegister(request), guard: 'none' },
  { method: 'POST', pattern: /^\/forgot-password$/, handler: (request) => handlePasswordEmail(request), guard: 'none' },
  { method: 'POST', pattern: /^\/reset-password$/, handler: (request) => handlePasswordReset(request), guard: 'none' },
  { method: 'POST', pattern: /^\/logout$/, handler: (request) => handleLogout(request), guard: 'none' },
  { method: 'POST', pattern: /^\/confirm-password$/, handler: (request) => handleConfirmPassword(request), guard: 'auth' },
  { method: 'PUT', pattern: /^\/password$/, handler: (request) => handlePasswordUpdate(request), guard: 'auth' },
  { method: 'PATCH', pattern: /^\/profile$/, handler: (request) => handleProfileUpdate(request), guard: 'auth' },
  { method: 'DELETE', pattern: /^\/profile$/, handler: (request) => handleProfileDestroy(request), guard: 'auth' },
  {
    method: 'POST',
    pattern: /^\/email\/verification-notification$/,
    handler: () => handleVerificationSend(),
    guard: 'auth',
  },
];

/**
 * Registered admin module routes. Modules append their routes to this list as
 * they are ported (see ./handlers/*). Kept separate from AUTH_ROUTES so the
 * dispatcher can apply the administrator guard by default.
 */
export const ADMIN_ROUTES: AdminRoute[] = [
  { method: 'POST', pattern: /^\/posts\/categories$/, handler: (r) => handleCategoryStore(r), guard: 'admin' },
  {
    method: 'DELETE',
    pattern: /^\/posts\/categories\/(\d+)$/,
    handler: (r, m) => handleCategoryDestroy(r, Number(m[1])),
    guard: 'admin',
  },
  { method: 'POST', pattern: /^\/posts\/tags$/, handler: (r) => handleTagStore(r), guard: 'admin' },
  {
    method: 'DELETE',
    pattern: /^\/posts\/tags\/(\d+)$/,
    handler: (r, m) => handleTagDestroy(r, Number(m[1])),
    guard: 'admin',
  },
  { method: 'POST', pattern: /^\/posts\/(\d+)\/restore$/, handler: (r, m) => handlePostRestore(r, Number(m[1])), guard: 'admin' },
  {
    method: 'DELETE',
    pattern: /^\/posts\/(\d+)\/force-delete$/,
    handler: (r, m) => handlePostForceDelete(r, Number(m[1])),
    guard: 'admin',
  },
  { method: 'POST', pattern: /^\/posts$/, handler: (r) => handlePostStore(r), guard: 'admin' },
  { method: 'PUT', pattern: /^\/posts\/(\d+)$/, handler: (r, m) => handlePostUpdate(r, Number(m[1])), guard: 'admin' },
  { method: 'PATCH', pattern: /^\/posts\/(\d+)$/, handler: (r, m) => handlePostUpdate(r, Number(m[1])), guard: 'admin' },
  { method: 'DELETE', pattern: /^\/posts\/(\d+)$/, handler: (r, m) => handlePostTrash(r, Number(m[1])), guard: 'admin' },
  { method: 'POST', pattern: /^\/users$/, handler: (r) => handleUserStore(r), guard: 'admin' },
  { method: 'PUT', pattern: /^\/users\/(\d+)$/, handler: (r, m) => handleUserUpdate(r, Number(m[1])), guard: 'admin' },
  { method: 'DELETE', pattern: /^\/users\/(\d+)$/, handler: (r, m) => handleUserDestroy(r, Number(m[1])), guard: 'admin' },

  // Custom pages
  { method: 'POST', pattern: /^\/pages\/quick-draft$/, handler: (r) => handlePageQuickDraft(r), guard: 'admin' },
  { method: 'POST', pattern: /^\/pages$/, handler: (r) => handlePageStore(r), guard: 'admin' },
  { method: 'PUT', pattern: /^\/pages\/(\d+)$/, handler: (r, m) => handlePageUpdate(r, Number(m[1])), guard: 'admin' },
  { method: 'PATCH', pattern: /^\/pages\/(\d+)$/, handler: (r, m) => handlePageUpdate(r, Number(m[1])), guard: 'admin' },
  { method: 'DELETE', pattern: /^\/pages\/(\d+)$/, handler: (r, m) => handlePageDestroy(r, Number(m[1])), guard: 'admin' },

  // Media library
  { method: 'GET', pattern: /^\/admin-api\/media$/, handler: (r) => handleMediaApiIndex(r), guard: 'admin' },
  { method: 'POST', pattern: /^\/admin-api\/media\/upload$/, handler: (r) => handleMediaApiUpload(r), guard: 'admin' },
  {
    method: 'DELETE',
    pattern: /^\/admin-api\/media\/bulk-delete$/,
    handler: (r) => handleMediaBulkDestroy(r),
    guard: 'admin',
  },
  { method: 'POST', pattern: /^\/admin-api\/media\/(\d+)\/rotate$/, handler: (r, m) => handleMediaRotate(r, Number(m[1])), guard: 'admin' },
  { method: 'POST', pattern: /^\/media$/, handler: (r) => handleMediaStore(r), guard: 'admin' },
  { method: 'PUT', pattern: /^\/media\/(\d+)$/, handler: (r, m) => handleMediaUpdate(r, Number(m[1])), guard: 'admin' },
  { method: 'PATCH', pattern: /^\/media\/(\d+)$/, handler: (r, m) => handleMediaUpdate(r, Number(m[1])), guard: 'admin' },
  { method: 'DELETE', pattern: /^\/media\/(\d+)$/, handler: (r, m) => handleMediaDestroy(r, Number(m[1])), guard: 'admin' },
  { method: 'GET', pattern: /^\/media\/(\d+)\/download$/, handler: (_r, m) => handleMediaDownload(Number(m[1])), guard: 'admin' },

  // Featured slider images
  { method: 'POST', pattern: /^\/featured-images\/reorder$/, handler: (r) => handleFeaturedImageReorder(r), guard: 'admin' },
  { method: 'POST', pattern: /^\/featured-images$/, handler: (r) => handleFeaturedImageStore(r), guard: 'admin' },
  { method: 'PUT', pattern: /^\/featured-images\/(\d+)$/, handler: (r, m) => handleFeaturedImageUpdate(r, Number(m[1])), guard: 'admin' },
  { method: 'PATCH', pattern: /^\/featured-images\/(\d+)$/, handler: (r, m) => handleFeaturedImageUpdate(r, Number(m[1])), guard: 'admin' },
  { method: 'DELETE', pattern: /^\/featured-images\/(\d+)$/, handler: (r, m) => handleFeaturedImageDestroy(r, Number(m[1])), guard: 'admin' },

  // Doctors
  { method: 'POST', pattern: /^\/doctors-admin\/settings$/, handler: (r) => handleDoctorSettings(r), guard: 'admin' },
  { method: 'POST', pattern: /^\/doctors\/reorder$/, handler: (r) => handleDoctorReorder(r), guard: 'admin' },
  { method: 'POST', pattern: /^\/doctors$/, handler: (r) => handleDoctorStore(r), guard: 'admin' },
  { method: 'PUT', pattern: /^\/doctors\/(\d+)$/, handler: (r, m) => handleDoctorUpdate(r, Number(m[1])), guard: 'admin' },
  { method: 'PATCH', pattern: /^\/doctors\/(\d+)$/, handler: (r, m) => handleDoctorUpdate(r, Number(m[1])), guard: 'admin' },
  { method: 'DELETE', pattern: /^\/doctors\/(\d+)$/, handler: (r, m) => handleDoctorDestroy(r, Number(m[1])), guard: 'admin' },

  // Corporate team
  { method: 'POST', pattern: /^\/team-admin\/reorder$/, handler: (r) => handleTeamReorder(r), guard: 'admin' },
  { method: 'POST', pattern: /^\/team-admin$/, handler: (r) => handleTeamStore(r), guard: 'admin' },
  { method: 'PUT', pattern: /^\/team-admin\/(\d+)$/, handler: (r, m) => handleTeamUpdate(r, Number(m[1])), guard: 'admin' },
  { method: 'PATCH', pattern: /^\/team-admin\/(\d+)$/, handler: (r, m) => handleTeamUpdate(r, Number(m[1])), guard: 'admin' },
  {
    method: 'POST',
    pattern: /^\/team-admin\/(\d+)\/toggle-active$/,
    handler: (r, m) => handleTeamToggle(r, Number(m[1])),
    guard: 'admin',
  },
  { method: 'DELETE', pattern: /^\/team-admin\/(\d+)$/, handler: (r, m) => handleTeamDestroy(r, Number(m[1])), guard: 'admin' },

  // Branches
  { method: 'POST', pattern: /^\/branch-admin\/reorder$/, handler: (r) => handleBranchReorder(r), guard: 'admin' },
  { method: 'POST', pattern: /^\/branch-admin$/, handler: (r) => handleBranchStore(r), guard: 'admin' },
  { method: 'PUT', pattern: /^\/branch-admin\/(\d+)$/, handler: (r, m) => handleBranchUpdate(r, Number(m[1])), guard: 'admin' },
  { method: 'PATCH', pattern: /^\/branch-admin\/(\d+)$/, handler: (r, m) => handleBranchUpdate(r, Number(m[1])), guard: 'admin' },
  { method: 'DELETE', pattern: /^\/branch-admin\/(\d+)$/, handler: (r, m) => handleBranchDestroy(r, Number(m[1])), guard: 'admin' },

  // Services
  { method: 'POST', pattern: /^\/services-admin\/reorder$/, handler: (r) => handleServiceReorder(r), guard: 'admin' },
  { method: 'POST', pattern: /^\/services-admin$/, handler: (r) => handleServiceStore(r), guard: 'admin' },
  { method: 'PUT', pattern: /^\/services-admin\/(\d+)$/, handler: (r, m) => handleServiceUpdate(r, Number(m[1])), guard: 'admin' },
  { method: 'PATCH', pattern: /^\/services-admin\/(\d+)$/, handler: (r, m) => handleServiceUpdate(r, Number(m[1])), guard: 'admin' },
  { method: 'DELETE', pattern: /^\/services-admin\/(\d+)$/, handler: (r, m) => handleServiceDestroy(r, Number(m[1])), guard: 'admin' },

  // Medicines
  { method: 'POST', pattern: /^\/medicines-admin\/reorder$/, handler: (r) => handleMedicineReorder(r), guard: 'admin' },
  { method: 'POST', pattern: /^\/medicines-admin$/, handler: (r) => handleMedicineStore(r), guard: 'admin' },
  { method: 'PUT', pattern: /^\/medicines-admin\/(\d+)$/, handler: (r, m) => handleMedicineUpdate(r, Number(m[1])), guard: 'admin' },
  { method: 'PATCH', pattern: /^\/medicines-admin\/(\d+)$/, handler: (r, m) => handleMedicineUpdate(r, Number(m[1])), guard: 'admin' },
  { method: 'DELETE', pattern: /^\/medicines-admin\/(\d+)$/, handler: (r, m) => handleMedicineDestroy(r, Number(m[1])), guard: 'admin' },

  // About page CMS
  { method: 'PUT', pattern: /^\/about-cms\/save$/, handler: (r) => handleAboutUpdate(r), guard: 'admin' },
  { method: 'PATCH', pattern: /^\/about-cms\/save$/, handler: (r) => handleAboutUpdate(r), guard: 'admin' },

  // Price list
  { method: 'POST', pattern: /^\/price-list-admin\/save$/, handler: (r) => handlePriceListSave(r), guard: 'admin' },

  // Site settings / header + footer / website texts
  { method: 'POST', pattern: /^\/settings-admin$/, handler: (r) => handleSettingsUpdate(r), guard: 'admin' },
  {
    method: 'POST',
    pattern: /^\/settings\/header-footer$/,
    handler: (r) => handleHeaderFooterUpdate(r),
    guard: 'admin',
  },
  {
    method: 'POST',
    pattern: /^\/settings\/website-texts$/,
    handler: (r) => handleWebsiteTextsSave(r),
    guard: 'admin',
  },

  // Navigation menus
  { method: 'POST', pattern: /^\/menus$/, handler: (r) => handleMenuStore(r), guard: 'admin' },
  { method: 'PUT', pattern: /^\/menus\/(\d+)$/, handler: (r, m) => handleMenuUpdate(r, Number(m[1])), guard: 'admin' },
  { method: 'PATCH', pattern: /^\/menus\/(\d+)$/, handler: (r, m) => handleMenuUpdate(r, Number(m[1])), guard: 'admin' },
  { method: 'DELETE', pattern: /^\/menus\/(\d+)$/, handler: (r, m) => handleMenuDestroy(r, Number(m[1])), guard: 'admin' },

  // URL redirects
  { method: 'POST', pattern: /^\/redirects-admin$/, handler: (r) => handleRedirectStore(r), guard: 'admin' },
  {
    method: 'PUT',
    pattern: /^\/redirects-admin\/(\d+)$/,
    handler: (r, m) => handleRedirectUpdate(r, Number(m[1])),
    guard: 'admin',
  },
  {
    method: 'PATCH',
    pattern: /^\/redirects-admin\/(\d+)$/,
    handler: (r, m) => handleRedirectUpdate(r, Number(m[1])),
    guard: 'admin',
  },
  {
    method: 'DELETE',
    pattern: /^\/redirects-admin\/(\d+)$/,
    handler: (r, m) => handleRedirectDestroy(r, Number(m[1])),
    guard: 'admin',
  },
  {
    method: 'POST',
    pattern: /^\/redirects-admin\/(\d+)\/toggle$/,
    handler: (r, m) => handleRedirectToggle(r, Number(m[1])),
    guard: 'admin',
  },

  // Homepage CMS
  { method: 'PUT', pattern: /^\/homepage-cms\/content$/, handler: (r) => handleHomepageContentSave(r), guard: 'admin' },
  { method: 'PATCH', pattern: /^\/homepage-cms\/content$/, handler: (r) => handleHomepageContentSave(r), guard: 'admin' },
  { method: 'POST', pattern: /^\/homepage-cms\/gallery$/, handler: (r) => handleHomepageGalleryStore(r), guard: 'admin' },
  { method: 'POST', pattern: /^\/homepage-cms\/gallery\/reorder$/, handler: (r) => handleHomepageGalleryReorder(r), guard: 'admin' },
  { method: 'PUT', pattern: /^\/homepage-cms\/gallery\/(\d+)$/, handler: (r, m) => handleHomepageGalleryUpdate(r, Number(m[1])), guard: 'admin' },
  { method: 'DELETE', pattern: /^\/homepage-cms\/gallery\/(\d+)$/, handler: (r, m) => handleHomepageGalleryDestroy(r, Number(m[1])), guard: 'admin' },
  { method: 'POST', pattern: /^\/homepage-cms\/videos$/, handler: (r) => handleHomepageVideoStore(r), guard: 'admin' },
  { method: 'POST', pattern: /^\/homepage-cms\/videos\/reorder$/, handler: (r) => handleHomepageVideoReorder(r), guard: 'admin' },
  { method: 'PUT', pattern: /^\/homepage-cms\/videos\/(\d+)$/, handler: (r, m) => handleHomepageVideoUpdate(r, Number(m[1])), guard: 'admin' },
  { method: 'DELETE', pattern: /^\/homepage-cms\/videos\/(\d+)$/, handler: (r, m) => handleHomepageVideoDestroy(r, Number(m[1])), guard: 'admin' },
  { method: 'PUT', pattern: /^\/homepage-cms\/branches\/(\d+)$/, handler: (r, m) => handleHomepageBranchUpdate(r, Number(m[1])), guard: 'admin' },
  { method: 'POST', pattern: /^\/homepage-cms\/branches\/reorder$/, handler: (r) => handleHomepageBranchReorder(r), guard: 'admin' },
  { method: 'PUT', pattern: /^\/homepage-cms\/doctors\/(\d+)$/, handler: (r, m) => handleHomepageDoctorUpdate(r, Number(m[1])), guard: 'admin' },
  { method: 'POST', pattern: /^\/homepage-cms\/doctors\/reorder$/, handler: (r) => handleHomepageDoctorReorder(r), guard: 'admin' },
  { method: 'PUT', pattern: /^\/homepage-cms\/services\/(\d+)$/, handler: (r, m) => handleHomepageServiceUpdate(r, Number(m[1])), guard: 'admin' },
  { method: 'POST', pattern: /^\/homepage-cms\/services\/reorder$/, handler: (r) => handleHomepageServiceReorder(r), guard: 'admin' },

  // Complaint box
  { method: 'PUT', pattern: /^\/complaints-admin\/(\d+)$/, handler: (r, m) => handleComplaintUpdate(r, Number(m[1])), guard: 'admin' },
  { method: 'DELETE', pattern: /^\/complaints-admin\/(\d+)$/, handler: (r, m) => handleComplaintDestroy(r, Number(m[1])), guard: 'admin' },

  // Patient rights CMS
  { method: 'POST', pattern: /^\/patient-rights-cms\/settings$/, handler: (r) => handlePatientRightsSettings(r), guard: 'admin' },
  { method: 'POST', pattern: /^\/patient-rights-cms\/rights$/, handler: (r) => handlePatientRightStore(r), guard: 'admin' },
  { method: 'PUT', pattern: /^\/patient-rights-cms\/rights\/(\d+)$/, handler: (r, m) => handlePatientRightUpdate(r, Number(m[1])), guard: 'admin' },
  { method: 'DELETE', pattern: /^\/patient-rights-cms\/rights\/(\d+)$/, handler: (r, m) => handlePatientRightDestroy(r, Number(m[1])), guard: 'admin' },
  { method: 'POST', pattern: /^\/patient-rights-cms\/rights\/reorder$/, handler: (r) => handlePatientRightsReorder(r), guard: 'admin' },
  { method: 'POST', pattern: /^\/patient-rights-cms\/responsibilities$/, handler: (r) => handlePatientResponsibilityStore(r), guard: 'admin' },
  { method: 'PUT', pattern: /^\/patient-rights-cms\/responsibilities\/(\d+)$/, handler: (r, m) => handlePatientResponsibilityUpdate(r, Number(m[1])), guard: 'admin' },
  { method: 'DELETE', pattern: /^\/patient-rights-cms\/responsibilities\/(\d+)$/, handler: (r, m) => handlePatientResponsibilityDestroy(r, Number(m[1])), guard: 'admin' },
  { method: 'POST', pattern: /^\/patient-rights-cms\/responsibilities\/reorder$/, handler: (r) => handlePatientResponsibilitiesReorder(r), guard: 'admin' },

  // How to Pay CMS
  { method: 'POST', pattern: /^\/how-to-pay-cms\/settings$/, handler: (r) => handleHowToPaySettings(r), guard: 'admin' },
  { method: 'POST', pattern: /^\/how-to-pay-cms\/methods$/, handler: (r) => handleHowToPayMethods(r), guard: 'admin' },
  { method: 'POST', pattern: /^\/how-to-pay-cms\/branches$/, handler: (r) => handleHowToPayBranches(r), guard: 'admin' },

  // Appointments
  { method: 'PUT', pattern: /^\/appointments\/(\d+)$/, handler: (r, m) => handleAppointmentUpdate(r, Number(m[1])), guard: 'admin' },
  { method: 'DELETE', pattern: /^\/appointments\/(\d+)$/, handler: (r, m) => handleAppointmentDestroy(r, Number(m[1])), guard: 'admin' },

  // AI assistant
  { method: 'POST', pattern: /^\/ai-assistant\/settings$/, handler: (r) => handleAiSettings(r), guard: 'admin' },
  { method: 'POST', pattern: /^\/ai-assistant\/rules$/, handler: (r) => handleAiRuleStore(r), guard: 'admin' },
  { method: 'POST', pattern: /^\/ai-assistant\/rules\/(\d+)\/toggle$/, handler: (r, m) => handleAiRuleToggle(r, Number(m[1])), guard: 'admin' },
  { method: 'PUT', pattern: /^\/ai-assistant\/rules\/(\d+)$/, handler: (r, m) => handleAiRuleUpdate(r, Number(m[1])), guard: 'admin' },
  { method: 'DELETE', pattern: /^\/ai-assistant\/rules\/(\d+)$/, handler: (r, m) => handleAiRuleDestroy(r, Number(m[1])), guard: 'admin' },
  { method: 'POST', pattern: /^\/ai-assistant\/test-gemini$/, handler: (r) => handleAiTestGemini(r), guard: 'admin' },
  { method: 'POST', pattern: /^\/ai-assistant\/fetch-models$/, handler: (r) => handleAiFetchModels(r), guard: 'admin' },
];

/** Handle a mutating request, or return null when the URL is not registered. */
export async function handleAdminRoute(request: Request, pathname: string): Promise<Response | null> {
  const method = request.method.toUpperCase();
  const path = pathname.replace(/\/+$/, '') || '/';

  for (const route of [...AUTH_ROUTES, ...ADMIN_ROUTES]) {
    if (route.method !== method) continue;
    const match = path.match(route.pattern);
    if (!match) continue;

    if (route.guard === 'admin') {
      const denied = guardAdmin(request);
      if (denied) return denied;
    } else if (route.guard === 'auth') {
      if (!currentAdmin(request)) {
        return jsonResponse({ message: 'Unauthenticated.' }, 401);
      }
    } else if (route.guard === 'none' && method !== 'POST' && method !== 'GET') {
      // Auth GET routes are pages; nothing to do here.
    }

    return route.handler(request, match);
  }

  return null;
}
