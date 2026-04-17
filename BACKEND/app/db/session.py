from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from app.core.config import settings

# 1. Dynamically set connection arguments based on the database dialect
connect_args = {}
if settings.async_database_uri.startswith("sqlite"):
    # Required for SQLite to prevent thread-sharing exceptions in async environments
    connect_args["check_same_thread"] = False

# 2. Initialize the Async Engine
engine = create_async_engine(
    settings.async_database_uri,
    connect_args=connect_args,
    pool_pre_ping=True,  # Automatically tests connections before using them (prevents dropouts)
    echo=False,          # Change to True to log all emitted SQL queries to the console
)

# 3. Create the Session Factory
# expire_on_commit=False is strictly required for AsyncSession. 
# It prevents SQLAlchemy from issuing lazy-loading queries outside of the active transaction.
async_session_maker = async_sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
    expire_on_commit=False,
)
