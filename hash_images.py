import os
import json
from PIL import Image
import imagehash

def deduplicate_images(directory):
    hashes = {}
    unique_files = []
    
    # Process files 1.png to 18.png in order
    for i in range(1, 19):
        filename = f"{i}.png"
        filepath = os.path.join(directory, filename)
        if not os.path.exists(filepath):
            continue
            
        try:
            with Image.open(filepath) as img:
                # Use a perceptual hash (dhash)
                img_hash = str(imagehash.dhash(img))
                
                # Check if we've seen this hash (or a very similar one)
                # For strict identical visuals, exact dhash match is usually enough.
                # If there are minor compressions, we can check for hamming distance.
                is_duplicate = False
                for existing_hash in hashes:
                    # Calculate hamming distance
                    dist = imagehash.hex_to_hash(img_hash) - imagehash.hex_to_hash(existing_hash)
                    if dist < 15: # High threshold to group similar video frames
                        is_duplicate = True
                        break
                        
                if not is_duplicate:
                    hashes[img_hash] = filename
                    unique_files.append(i)
        except Exception as e:
            print(f"Error processing {filename}: {e}")
            
    return unique_files

if __name__ == "__main__":
    directory = r"artifacts\pet-wellness\public\pet"
    unique = deduplicate_images(directory)
    print(json.dumps(unique))
