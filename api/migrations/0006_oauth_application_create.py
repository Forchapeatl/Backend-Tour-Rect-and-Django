from django.db import migrations

import oauth2_provider.models

def create_oauth_app(apps, schema_editor):
    Application = oauth2_provider.models.Application
    Application.objects.create(
        name='Frontend',
        client_id='wql5aqXepfkcF0JQOAoOo921zbvcrQSg1MUb2VUe',
        client_secret='tVnwobvL4C7D76AOsYkrtDLh1D1mahbUqkzSBfqVi2zXfsBBD9Jm8FNe6yWof1XYIOwBfxtKrZh4Eug3piGu94Oga2R0VHJVG2VxQn1pw5Y5xcBOva0IX1n4WrPXZn0N',
        client_type='confidential',
        authorization_grant_type='password',
    )
    Application.objects.create(
        name='React',
        client_id='UYpBkKY6vYW72ayc7ovAZ5xvUapQ3a8TucsGI2jS',
        client_secret='REvBZR4e1yVflIrF1FAWcLVl08ZtewuxinaQsSNt6XKpxar6v17LvjkrCkKVDqHQUTDCcLfuZfm1V7JQ0C9qdKnYQpbjjjMrYMt76kdzTtE3xGv4ZaxdX9TnLsTeadZu',
        client_type='public',
        authorization_grant_type='client-credentials',
    )

class Migration(migrations.Migration):

    dependencies = [
        ('oauth2_provider', '__latest__'),
        ('api', '0005_data_migration'),
    ]

    operations = [
        migrations.RunPython(create_oauth_app),
    ]