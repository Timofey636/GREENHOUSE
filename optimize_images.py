from pathlib import Path
from PIL import Image
import re

ROOT = Path(__file__).parent
IMAGES = ROOT / "images"
SCRIPT = ROOT / "script.js"

count = 0

for folder in IMAGES.rglob("*"):
    if not folder.is_file():
        continue

    if folder.suffix.lower() not in (".jpg", ".jpeg", ".png"):
        continue

    try:
        img = Image.open(folder)
        img.thumbnail((1600, 1600))

        output = folder.with_suffix(".webp")

        img.save(
            output,
            "WEBP",
            quality=82,
            method=6
        )

        count += 1
        print(f"Готово: {output.relative_to(ROOT)}")

    except Exception as error:
        print(f"Ошибка: {folder} — {error}")

# Обновляем основные пути в script.js
text = SCRIPT.read_text(encoding="utf-8")

text = re.sub(
    r'(image:\s*"images/plant\d+/\d+)\.(?:jpg|jpeg|png"',
    r'\1.webp"',
    text,
    flags=re.IGNORECASE
)

SCRIPT.write_text(text, encoding="utf-8")

print(f"\nКонвертировано фотографий: {count}")
print("Основные пути в script.js обновлены.")
print("Готово!")