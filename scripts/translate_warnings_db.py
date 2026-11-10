import sqlite3, json

conn = sqlite3.connect("database/database.sqlite")
cursor = conn.cursor()

warning_map = {
    'Prescription Only: Take strictly under medical guidance.': (
        'প্রেসক্রিপশন অনুযায়ী সেব্য',
        'শুধুমাত্র চিকিৎসকের পরামর্শ ও প্রেসক্রিপশন অনুযায়ী সেবন করুন।'
    ),
    'Consult your doctor if you have known kidney or liver impairment.': (
        'কিডনি ও লিভারের সতর্কতা',
        'কিডনি বা লিভারের জটিলতা থাকলে সেবনের পূর্বে চিকিৎসকের পরামর্শ নেওয়া আবশ্যক।'
    ),
    'Consult your physician before taking during pregnancy or breastfeeding.': (
        'গর্ভাবস্থা ও স্তন্যদানকালীন সতর্কতা',
        'গর্ভবতী বা স্তন্যদানকারী মায়েদের ক্ষেত্রে ব্যবহারের আগে ডাক্তারের পরামর্শ নিন।'
    ),
    'Avoid driving or heavy machinery operation until you know how Cetirizine affects your focus.': (
        'সতর্কতা',
        'ওষুধ সেবনের পর তন্দ্রাচ্ছন্নতা বা ঝিমুনি দেখা দিলে গাড়ি বা ভারী যন্ত্রপাতি পরিচালনা থেকে বিরত থাকুন।'
    ),
    'Concurrent alcohol intake may amplify drowsiness or impair mental alertness.': (
        'অ্যালকোহল সতর্কতা',
        'ওষুধ গ্রহণের সময় কোনো প্রকার অ্যালকোহল সেবন করবেন না।'
    ),
    'Patients with renal impairment require a reduced dosage (5 mg daily).': (
        'কিডনি রোগীদের মাত্রা',
        'কিডনি রোগীদের ক্ষেত্রে চিকিৎসকের পরামর্শ নিয়ে নির্ধারিত মাত্রায় সেবন করতে হবে।'
    )
}

cursor.execute("SELECT id, slug, warnings FROM medicines")
rows = cursor.fetchall()
updated_count = 0

for r in rows:
    mid, slug, warn_raw = r
    if not warn_raw or not warn_raw.strip().startswith('['):
        continue
    try:
        warn_list = json.loads(warn_raw)
        modified = False
        for w in warn_list:
            if isinstance(w, dict):
                txt = w.get('text', '')
                if txt in warning_map:
                    lbl_bn, txt_bn = warning_map[txt]
                    w['label_bn'] = lbl_bn
                    w['text_bn'] = txt_bn
                    modified = True
                elif not w.get('text_bn'):
                    # Generic fallback translation if any
                    for k, (lbl_bn, txt_bn) in warning_map.items():
                        if k.lower() in txt.lower():
                            w['label_bn'] = lbl_bn
                            w['text_bn'] = txt_bn
                            modified = True
                            break
        if modified:
            cursor.execute("UPDATE medicines SET warnings = ? WHERE id = ?", (json.dumps(warn_list, ensure_ascii=False), mid))
            updated_count += 1
    except Exception as e:
        print(f"Error on {slug}: {e}")

conn.commit()
print(f"Updated warnings with Bengali translations in {updated_count} medicines!")

