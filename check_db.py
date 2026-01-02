import sqlite3
import os

db_path = os.path.join('backend', 'joram_cars.db')
if not os.path.exists(db_path):
    print(f"Database not found at {db_path}")
    exit(1)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

print("--- Vehicles Summary ---")
cursor.execute("SELECT availability_status, COUNT(*) FROM vehicles GROUP BY availability_status")
rows = cursor.fetchall()
for row in rows:
    print(f"Status: {row[0]}, Count: {row[1]}")

conn.close()
