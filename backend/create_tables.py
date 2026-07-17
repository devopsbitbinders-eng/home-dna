from database import engine, Base
import models

print("Connecting to Hostinger Database...")
Base.metadata.create_all(bind=engine)
print("✅ All tables created successfully!")
