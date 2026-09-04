import json
from app.database import SessionLocal
from app.models.user import User

def seed_database():
    db = SessionLocal()
    try:
        with open("seed_data.json", "r") as file:
            users_data = json.load(file)
            
            for user_data in users_data:
                # Check if user already exists
                existing_user = db.query(User).filter(User.id == user_data["id"]).first()
                if not existing_user:
                    new_user = User(**user_data)
                    db.add(new_user)
            
            db.commit()
            print("Successfully migrated all users to Supabase!")
    except Exception as e:
        print(f"An error occurred: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
