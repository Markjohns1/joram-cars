import sqlite3
import os

db_path = os.path.join('backend', 'joram_cars.db')
if not os.path.exists(db_path):
    print(f"Database not found at {db_path}")
    exit(1)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

print("--- Updating Vehicle Statuses ---")
cursor.execute("UPDATE vehicles SET availability_status = 'available' WHERE availability_status = 'Available'")
print(f"Updated {conn.total_changes} rows to 'available'")

conn.commit()
conn.close()
print("Done.")
