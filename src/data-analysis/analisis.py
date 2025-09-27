import pandas as pd
# Importa las funciones del módulo de preprocesamiento
from .preprocesamiento import cargar_datos, manejar_nulos, estandarizar_texto, limpieza_especifica

# Rutas de los archivos (relativas a la raíz del proyecto)
USUARIOS_PATH = 'data/usuarios.csv' 
PUBLICACIONES_PATH = 'data/publicaciones.json' 

def realizar_analisis():
    print("--- 1. Carga y Preprocesamiento de Datos ---")
    df_usuarios, df_publicaciones = cargar_datos(USUARIOS_PATH, PUBLICACIONES_PATH)
    
    # Aplicar funciones de limpieza (Trabajo de Miembro 1 - Santiago):
    df_usuarios = manejar_nulos(df_usuarios, 'biografia')
    df_usuarios = estandarizar_texto(df_usuarios, 'intereses')
    df_publicaciones = limpieza_especifica(df_publicaciones, 'estado') 

    # Combinación de datos (Merge): Requisito de la tarea
    df_combinado = pd.merge(df_usuarios, df_publicaciones, on='id_usuario', how='inner')
    print("Datos cargados, limpios y combinados correctamente.")
    
    # ------------------------------------------------------------------
    # 3. ANÁLISIS DE FRECUENCIA (Pregunta 1: Elemento más popular)
    # ------------------------------------------------------------------
    # Se agrupa por intereses (ya estandarizados) y se cuenta el registro más frecuente.
    interes_mas_popular = df_combinado['intereses'].value_counts().idxmax()
    
    print("\n--- 3. Análisis de Frecuencia ---")
    print(f"El interés más popular en las publicaciones de voz es: '{interes_mas_popular}'")


    # ------------------------------------------------------------------
    # 4. ANÁLISIS DE AGREGACIÓN (Pregunta 2: Métrica clave agrupada)
    # ------------------------------------------------------------------
    # Se agrupa por intereses y se calcula el promedio de la duración de los audios.
    duracion_promedio_por_interes = df_combinado.groupby('intereses')['duracion_segundos'].mean().sort_values(ascending=False)
    
    print("\n--- 4. Análisis de Agregación ---")
    print("Duración promedio (segundos) de publicaciones por interés (Top 5):")
    print(duracion_promedio_por_interes.head().to_string()) # to_string() para imprimir bien en consola


    # ------------------------------------------------------------------
    # 5. ANÁLISIS CON FILTRADO Y CONTEO (Pregunta 3: Segmentar y Contar)
    # ------------------------------------------------------------------
    # Se filtra por dos condiciones: estado 'PUBLICADO' y duración > 60 segundos.
    
    publicaciones_filtradas = df_combinado[
        (df_combinado['estado'] == 'PUBLICADO') & 
        (df_combinado['duracion_segundos'] > 60)
    ]
    
    # Se cuenta el número de filas que cumplen ambas condiciones
    conteo_publicaciones = publicaciones_filtradas.shape[0]
    
    print("\n--- 5. Análisis con Filtrado y Conteo ---")
    print(f"Número de publicaciones > 60 segundos y en estado 'PUBLICADO': {conteo_publicaciones}")
    
    return df_combinado

if __name__ == '__main__':
    df_resultado = realizar_analisis()