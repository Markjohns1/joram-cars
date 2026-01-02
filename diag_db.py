import sqlite3
import os

db_path = os.path.join('backend', 'joram_cars.db')
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

cursor.execute("SELECT id, availability_status FROM vehicles")
rows = cursor.fetchall()
for row in rows:
    print(f"ID: {row[0]}, Status: |{row[1]}|, Raw: {repr(row[1])}")

conn.close()
