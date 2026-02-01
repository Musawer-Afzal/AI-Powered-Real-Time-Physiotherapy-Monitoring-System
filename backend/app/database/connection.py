from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
import os
from dotenv import load_dotenv

load_dotenv()

class Database:
    _instance = None
    _client = None
    _db = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(Database, cls).__new__(cls)
        return cls._instance
    
    def connect(self):
        """Connect to MongoDB"""
        try:
            # For local MongoDB
            self._client = MongoClient(os.getenv("MONGODB_URI", "mongodb://localhost:27017"))
            
            # Test connection
            self._client.admin.command('ping')
            self._db = self._client["physiotherapy_db"]
            
            print("✅ Connected to MongoDB")
            self._setup_indexes()
            
        except ConnectionFailure as e:
            print(f"❌ MongoDB connection failed: {e}")
            raise
    
    def _setup_indexes(self):
        """Create indexes for better performance"""
        self._db.sessions.create_index("patient_id")
        self._db.sessions.create_index("exercise_type")
        self._db.sessions.create_index([("timestamp", -1)])
    
    @property
    def db(self):
        if self._db is None:
            self.connect()
        return self._db
    
    def close(self):
        """Close database connection"""
        if self._client:
            self._client.close()

def init_db():
    """Initialize database connection"""
    db = Database()
    db.connect()
    return db.db

# Singleton instance
database = Database()