# ner_service.py
import sys
import json
import spacy

# Load the English language model
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("Error: spaCy English model 'en_core_web_sm' not found.", file=sys.stderr)
    print("Please run: python -m spacy download en_core_web_sm", file=sys.stderr)
    sys.exit(1)

def extract_person_names(text):
    doc = nlp(text)
    person_names = []
    for ent in doc.ents:
        if ent.label_ == "PERSON":
            person_names.append(ent.text)
    return person_names

if __name__ == "__main__":
    if len(sys.argv) > 1:
        input_text = sys.argv[1]
        names = extract_person_names(input_text)
        print(json.dumps(names))
    else:
        print(json.dumps([])) # Return empty array if no text provided