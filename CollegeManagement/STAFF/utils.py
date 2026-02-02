import base64
import uuid
import os
from django.core.files.base import ContentFile
from django.conf import settings

months_dict = {'1':'January','2':'February','3':'March','4':'April','5':'May','6':'June','7':'July','8':'August',
               '9':'September','10':'October','11':'November','12':'December'}




def save_base64_file(base64_data, upload_dir='uploads/'):
    # Check for data URI format: data:<mime>;base64,<data>
    if ',' in base64_data:
        header, base64_data = base64_data.split(',', 1)

    file_ext = get_file_extension_from_base64(base64_data)
    file_name = f"{uuid.uuid4()}.{file_ext}"
    file_path = os.path.join(upload_dir, file_name)

    # Decode and save file
    decoded_file = base64.b64decode(base64_data)
    full_path = os.path.join(settings.MEDIA_ROOT, file_path)

    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, 'wb') as f:
        f.write(decoded_file)

    return file_path  # this is the relative path to MEDIA_ROOT

def is_pdf(base64_data):
    try:
        decoded_data = base64.b64decode(base64_data)
        return decoded_data.startswith(b'%PDF')
    except Exception as e:
        print(f"Error decoding base64: {e}")
        return False
def get_file_extension_from_base64(base64_data):
    # You can refine this logic to detect image/pdf/docx etc.
    try:
        import imghdr
        resp = imghdr.what(None, h=base64.b64decode(base64_data))
        if resp is None:
            if is_pdf(base64_data):
                return 'pdf'
            else:
                return 'bin'
        else:
            return imghdr.what(None, h=base64.b64decode(base64_data))
    except Exception:
        return 'bin'


def save_image(image_file):
    upload_dir = os.path.join(settings.MEDIA_ROOT, 'uploads')
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join('uploads', image_file.name)
    full_path = os.path.join(settings.MEDIA_ROOT, file_path)

    with open(full_path, 'wb+') as f:
        for chunk in image_file.chunks():
            f.write(chunk)

    return full_path