import pandas as pd
import google.generativeai as genai

genai.configure(api_key="AIzaSyDbhaLZGrQawLI1mO2sVB-fzk10yqI0hUs")  # Reemplaza con API key
model = genai.GenerativeModel('gemini-1.5-pro-latest')

df = pd.read_csv("Dataset.csv", encoding='latin-1')
reseñas_por_libro = df.groupby("ISBN")["Reseña"].apply("\n".join).reset_index()

# 3. Función para resumir con Gemini
def resumir_con_gemini(texto):
    prompt = f"""
    Resume las siguientes reseñas de libros, destacando:
    - Opiniones positivas y negativas.
    - Elementos más mencionados (personajes, trama, estilo).
    - Sentimiento general (polarizado/mixto/consenso).
    Sé neutral y conciso (máx. 18 líneas).
    Da tu opinion estimada por las reseñas de los demas pero no digas que es tu opinion y solo menciona lo que piensas

    Reseñas:
    {texto}
    """
    response = model.generate_content(prompt)
    return response.text

# 4. Procesar cada libro
for index, row in reseñas_por_libro.iterrows():
    isbn = row["ISBN"]
    texto = row["Reseña"][:10000]
    
    print(f"\nISBN: {isbn}")
    print("Resumen (Gemini):")
    print(resumir_con_gemini(texto))