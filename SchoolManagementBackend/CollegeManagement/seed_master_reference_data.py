#!/usr/bin/env python
import os

import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Swostitech_Acadix.settings")
django.setup()

from Acadix.models import (  # noqa: E402
    Bank,
    Blood,
    Branch,
    Category,
    City,
    Country,
    Document,
    FeeElementType,
    Gender,
    House,
    MotherTongue,
    Nationality,
    Organization,
    PaymentMethod,
    Profession,
    Religion,
    State,
)
from django.contrib.auth import get_user_model  # noqa: E402


GENDERS = [
    ("M", "Male"),
    ("F", "Female"),
]

CATEGORIES = [
    ("GENERAL", "GENERAL"),
    ("OBC", "OBC"),
    ("SEBC", "SEBC"),
    ("ST", "ST"),
    ("SC", "SC"),
]

HOUSES = [
    ("Ganga", "Ganga", "Blue"),
    ("Yamuna", "Yamuna", "1"),
]

NATIONALITIES = [
    ("Indian", "Indian"),
]

MOTHER_TONGUES = [
    ("Odia", "Odia"),
    ("Hindi", "Hindi"),
    ("English", "English"),
    ("Bengali", "Bengali"),
    ("Telugu", "Telugu"),
    ("Koya", "Koya"),
    ("Bonda", "Bonda"),
    ("Kandha", "Kandha"),
    ("Dombo", "Dombo"),
    ("Santali", "Santali"),
    ("Maithili", "Maithili"),
]

BLOODS = [
    ("A+", "A+"),
    ("O+", "O+"),
    ("O-", "O-"),
    ("A-", "A-"),
    ("B+", "B+"),
    ("B-", "B-"),
    ("AB+", "AB+"),
    ("AB-", "AB-"),
]

COUNTRIES = [
    ("India", "India"),
]

STATES = [
    ("Odisha", "Odisha", "India"),
]

CITIES = [
    ("Bhubaneswar", "Bhubaneswar", "India", "Odisha"),
]

RELIGIONS = [
    ("Buddhism", "Buddhism"),
    ("Sikhism", "Sikhism"),
    ("Judaism", "Judaism"),
    ("Jainism", "Jainism"),
    ("Shinto", "Shinto"),
    ("Taoism", "Taoism"),
    ("Hindu", "Hindu"),
    ("Christian", "Christian"),
    ("Muslim", "Muslim"),
]

PROFESSIONS = [
    ("Business", "Business"),
    ("Farmer", "Farmer"),
    ("Private Job", "Private Job"),
    ("Govt job", "Govt job"),
    ("Driver", "Driver"),
    ("Teacher", "Teacher"),
    ("Labour", "Labour"),
    ("Security", "Security"),
    ("Mechanic", "Mechanic"),
    ("Sweeper", "Sweeper"),
    ("Agriculture", "Agriculture"),
    ("Barber", "Barber"),
    ("other", "other"),
    ("Housewife", "Housewife"),
]

DOCUMENTS = [
    ("10th Certificate", "10th Certificate"),
    ("10th Marksheet", "10th Marksheet"),
    ("12th Certificate", "12th Certificate"),
    ("12th Marksheet", "12th Marksheet"),
    ("CLC", "CLC"),
    ("Migration Certificate", "Migration Certificate"),
    ("Caste Certificate", "Caste Certificate"),
    ("Residence Certificate", "Residence Certificate"),
    ("Pan Card", "Pan Card"),
    ("Photo", "Photo"),
    ("Income Certificate", "Income Certificate"),
    ("Aadhaar card", "Aadhaar card"),
    ("MSc", "MSc"),
    ("BSc", "BSc"),
]

PAYMENT_METHODS = [
    ("UPI", "UPI"),
    ("RTGS/NEFT", "RTGS/NEFT"),
    ("DD", "DD"),
    ("Cheque", "Cheque"),
    ("Cash", "Cash"),
    ("Bank", "Bank"),
]

BANKS = [
    "AXIS",
    "HDFC",
]

FEE_ELEMENT_TYPES = [
    ("ADDMISSION FEES", "ADDMISSION FEES", 1, "A"),
    ("TUTION FEES ADJUSTMENT", "TUTION FEES ADJUSTMENT", 1, "A"),
    ("TRIP CHARGES", "TRIP CHARGES", 1, "A"),
    ("SLC CHARGES", "SLC CHARGES", 1, "A"),
    ("OTHER ADJUSTMENT", "OTHER ADJUSTMENT", 1, "A"),
    ("MISCELLANEOUS CHARGES", "MISCELLANEOUS CHARGES", 1, "A"),
    ("FUNCTION ACTIVITY CHARGES", "FUNCTION ACTIVITY CHARGES", 1, "A"),
    ("EXAMINATION FEES", "EXAMINATION FEES", 1, "A"),
    ("CBSE REGISTRATION FEES", "CBSE REGISTRATION FEES", 1, "A"),
    ("Tuition fee", "Tuition fee", 1, "S"),
    ("Academic Fees", "Academic Fees", 1, "S"),
    ("Zero Fee", "Zero Fee", 1, "S"),
    ("Course Fee", "Course Fee", 1, "S"),
    ("Other Fee", "Other Fee", 1, "S"),
]


def get_created_by():
    user = get_user_model().objects.filter(is_superuser=True).order_by("id").first()
    return user.id if user else 1


def upsert_org_branch_model(model, code_field, name_field, rows, organization, branch, created_by):
    created = 0
    for code, name in rows:
        obj, was_created = model.objects.get_or_create(
            organization=organization,
            branch=branch,
            **{code_field: code},
            defaults={
                name_field: name,
                "is_active": True,
                "created_by": created_by,
            },
        )
        if was_created:
            created += 1
        else:
            changed = False
            if getattr(obj, name_field) != name:
                setattr(obj, name_field, name)
                changed = True
            if not obj.is_active:
                obj.is_active = True
                changed = True
            if changed:
                obj.updated_by = created_by
                obj.save()
    return created


def upsert_house(rows, organization, branch, created_by):
    created = 0
    for code, name, color in rows:
        obj, was_created = House.objects.get_or_create(
            organization=organization,
            branch=branch,
            house_code=code,
            defaults={
                "house_name": name,
                "house_color": color,
                "is_active": True,
                "created_by": created_by,
            },
        )
        if was_created:
            created += 1
        else:
            changed = False
            for field, value in {
                "house_name": name,
                "house_color": color,
                "is_active": True,
            }.items():
                if getattr(obj, field) != value:
                    setattr(obj, field, value)
                    changed = True
            if changed:
                obj.updated_by = created_by
                obj.save()
    return created


def upsert_simple_model(model, code_field, desc_field, rows):
    created = 0
    for code, desc in rows:
        obj, was_created = model.objects.get_or_create(
            **{code_field: code},
            defaults={
                desc_field: desc,
                "is_active": True,
            },
        )
        if was_created:
            created += 1
        else:
            changed = False
            if getattr(obj, desc_field) != desc:
                setattr(obj, desc_field, desc)
                changed = True
            if not obj.is_active:
                obj.is_active = True
                changed = True
            if changed:
                obj.save()
    return created


def upsert_payment_methods(rows, organization, branch):
    created = 0
    for payment_method, payment_method_desc in rows:
        obj, was_created = PaymentMethod.objects.get_or_create(
            organization=organization,
            branch=branch,
            payment_method=payment_method,
            defaults={
                "payment_method_desc": payment_method_desc,
                "is_active": True,
            },
        )
        if was_created:
            created += 1
        else:
            changed = False
            if obj.payment_method_desc != payment_method_desc:
                obj.payment_method_desc = payment_method_desc
                changed = True
            if not obj.is_active:
                obj.is_active = True
                changed = True
            if changed:
                obj.save()
    return created


def upsert_banks(rows, organization, branch):
    created = 0
    for bank_name in rows:
        obj, was_created = Bank.objects.get_or_create(
            organization=organization,
            branch=branch,
            bank_name=bank_name,
            defaults={
                "is_active": True,
            },
        )
        if was_created:
            created += 1
        else:
            if not obj.is_active:
                obj.is_active = True
                obj.save()
    return created


def upsert_fee_element_types(rows, organization, branch, created_by):
    created = 0
    for element_name, element_description, sequence_order, element_type in rows:
        obj, was_created = FeeElementType.objects.get_or_create(
            element_name=element_name,
            defaults={
                "element_description": element_description,
                "organization": organization,
                "branch": branch,
                "sequence_order": sequence_order,
                "element_type": element_type,
                "is_active": True,
                "created_by": created_by,
            },
        )
        if was_created:
            created += 1
        else:
            changed = False
            for field, value in {
                "element_description": element_description,
                "organization": organization,
                "branch": branch,
                "sequence_order": sequence_order,
                "element_type": element_type,
                "is_active": True,
            }.items():
                current = getattr(obj, field)
                if current != value:
                    setattr(obj, field, value)
                    changed = True
            if changed:
                obj.updated_by = created_by
                obj.save()
    return created


def upsert_states(rows, organization, branch, created_by):
    created = 0
    for state_code, state_name, country_name in rows:
        country = Country.objects.get(
            organization=organization,
            branch=branch,
            country_name=country_name,
        )
        obj, was_created = State.objects.get_or_create(
            organization=organization,
            branch=branch,
            state_code=state_code,
            defaults={
                "state_name": state_name,
                "country": country,
                "is_active": True,
                "created_by": created_by,
            },
        )
        if was_created:
            created += 1
        else:
            changed = False
            if obj.state_name != state_name:
                obj.state_name = state_name
                changed = True
            if obj.country_id != country.id:
                obj.country = country
                changed = True
            if not obj.is_active:
                obj.is_active = True
                changed = True
            if changed:
                obj.updated_by = created_by
                obj.save()
    return created


def upsert_cities(rows, organization, branch, created_by):
    created = 0
    for city_code, city_name, country_name, state_name in rows:
        country = Country.objects.get(
            organization=organization,
            branch=branch,
            country_name=country_name,
        )
        state = State.objects.get(
            organization=organization,
            branch=branch,
            state_name=state_name,
            country=country,
        )
        obj, was_created = City.objects.get_or_create(
            organization=organization,
            branch=branch,
            city_code=city_code,
            defaults={
                "city_name": city_name,
                "country": country,
                "state": state,
                "is_active": True,
                "created_by": created_by,
            },
        )
        if was_created:
            created += 1
        else:
            changed = False
            for field, value in {
                "city_name": city_name,
                "country": country,
                "state": state,
                "is_active": True,
            }.items():
                current = getattr(obj, field)
                if current != value:
                    setattr(obj, field, value)
                    changed = True
            if changed:
                obj.updated_by = created_by
                obj.save()
    return created


def seed():
    organization = Organization.objects.get(id=1)
    branch = Branch.objects.get(id=1)
    created_by = get_created_by()

    stats = {
        "genders": upsert_org_branch_model(Gender, "gender_code", "gender_name", GENDERS, organization, branch, created_by),
        "categories": upsert_org_branch_model(Category, "category_code", "category_name", CATEGORIES, organization, branch, created_by),
        "houses": upsert_house(HOUSES, organization, branch, created_by),
        "nationalities": upsert_org_branch_model(Nationality, "nationality_code", "nationality_name", NATIONALITIES, organization, branch, created_by),
        "mother_tongues": upsert_org_branch_model(MotherTongue, "mother_tongue_code", "mother_tongue_name", MOTHER_TONGUES, organization, branch, created_by),
        "bloods": upsert_org_branch_model(Blood, "blood_code", "blood_name", BLOODS, organization, branch, created_by),
        "countries": upsert_org_branch_model(Country, "country_code", "country_name", COUNTRIES, organization, branch, created_by),
        "states": upsert_states(STATES, organization, branch, created_by),
        "cities": upsert_cities(CITIES, organization, branch, created_by),
        "religions": upsert_org_branch_model(Religion, "religion_code", "religion_name", RELIGIONS, organization, branch, created_by),
        "professions": upsert_simple_model(Profession, "profession_code", "profession_description", PROFESSIONS),
        "documents": upsert_simple_model(Document, "document_code", "document_desc", DOCUMENTS),
        "payment_methods": upsert_payment_methods(PAYMENT_METHODS, organization, branch),
        "banks": upsert_banks(BANKS, organization, branch),
        "fee_element_types": upsert_fee_element_types(FEE_ELEMENT_TYPES, organization, branch, created_by),
    }

    print("Reference seed completed.")
    for key, value in stats.items():
        print(f"{key}: {value}")


if __name__ == "__main__":
    seed()
