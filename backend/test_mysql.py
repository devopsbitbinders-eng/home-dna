import sqlalchemy
from sqlalchemy import create_engine

combinations = [
    "mysql+pymysql://root@127.0.0.1/home_dna",
    "mysql+pymysql://root:root123@127.0.0.1/home_dna",
    "mysql+pymysql://root@localhost/home_dna",
    "mysql+pymysql://root:root123@localhost/home_dna",
    "mysql+pymysql://root:@127.0.0.1/home_dna",
    "mysql+pymysql://root:@localhost/home_dna",
]

print("Testing all possible MySQL combinations...")

success = False
for url in combinations:
    print(f"\nTrying: {url}")
    try:
        engine = create_engine(url)
        connection = engine.connect()
        print("✅ SUCCESS! This is your exact connection string.")
        connection.close()
        success = True
        break
    except Exception as e:
        error_msg = str(e).split("\n")[0]
        print(f"❌ Failed: {error_msg}")

if not success:
    print("\n⚠️ ALL COMBINATIONS FAILED!")
    print("This means your phpMyAdmin MySQL server either:")
    print("1. Has a completely different password you forgot.")
    print("2. The database 'home_dna' does not exist yet (you need to create it in phpMyAdmin first).")
