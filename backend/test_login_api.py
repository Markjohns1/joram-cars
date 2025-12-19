import requests
import json

base_url = "http://localhost:8000/api"
login_url = f"{base_url}/auth/login"

payload = {
    "email": "carseller@gmail.com",
    "password": "carseller2025"
}

print(f"Testing Login at {login_url}...")
try:
    response = requests.post(login_url, json=payload)
    print(f"Status Code: {response.status_code}")
    print(f"Response Body: {response.text}")
    
    if response.status_code == 200:
        data = response.json()
        token = data.get("access_token")
        print(f"Token received: {token[:20]}...")
        
        # Test Dashboard with token
        dashboard_url = f"{base_url}/admin/dashboard"
        print(f"\nTesting Dashboard at {dashboard_url}...")
        headers = {"Authorization": f"Bearer {token}"}
        resp = requests.get(dashboard_url, headers=headers)
        print(f"Status Code: {resp.status_code}")
        print(f"Response Body: {resp.text}")
    else:
        print("Login failed.")
except Exception as e:
    print(f"Error: {e}")
