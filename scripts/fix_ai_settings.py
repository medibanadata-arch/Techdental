import sqlite3
import json

conn = sqlite3.connect('database/database.sqlite')
c = conn.cursor()

chips = json.dumps(["শাখার ঠিকানা কোথায়?", "ফাঁকা দাঁতের চিকিৎসা", "দাঁত ব্যথার চিকিৎসা"], ensure_ascii=False)
starter_questions = json.dumps([
    "ফিলিং চিকিৎসার খরচ কত?",
    "দাঁতে গর্ত হলে কি করা উচিৎ?",
    "রুট ক্যানেল করতে কত খরচ হয়?",
    "দাঁত সোজা করার উপায় কি?"
], ensure_ascii=False)

c.execute("UPDATE ai_chat_settings SET chips = ?, starter_questions = ? WHERE id = 1", (chips, starter_questions))
conn.commit()

row = c.execute("SELECT id, chips, starter_questions FROM ai_chat_settings WHERE id = 1").fetchone()
print("Updated ai_chat_settings:", row)
