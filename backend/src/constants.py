"""Constants and Configurations."""
from enum import Enum


class Role(Enum):
    """Enum class for User Roles."""

    FACULTY_MEMBER = 'faculty_member'
    EXTERNAL_GUEST = 'external_guest'
