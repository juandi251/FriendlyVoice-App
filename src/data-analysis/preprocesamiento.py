import pandas as pd
import json

# Función 1: Para cargar datos
def cargar_datos(usuarios_csv_path, publicaciones_json_path):
    """Carga los dos conjuntos de datos y retorna DataFrames."""
    df_usuarios = pd.read_csv(usuarios_csv_path)
    
    # Cargar JSON
    with open(publicaciones_json_path, 'r') as f:
        data_publicaciones = json.load(f)
    df_publicaciones = pd.DataFrame(data_publicaciones)
    
    return df_usuarios, df_publicaciones

# ------------------------------------------------------------------
# Funciones de Limpieza (Tareas del Miembro 1)
# ------------------------------------------------------------------

# Función 2: Manejar valores nulos (Se deja sin verificación, ya que .fillna() es seguro)
def manejar_nulos(df, columna):
    """Reemplaza los valores nulos en la columna especificada con 'Desconocido'."""
    # Lógica: Rellena los valores NaN (nulos) con la cadena 'Desconocido'
    df[columna] = df[columna].fillna('Desconocido')
    return df

# Función 3: Estandarizar texto (CORREGIDA con verificación de tipo)
def estandarizar_texto(df, columna):
    """Convierte a minúsculas y quita espacios extra en la columna."""
    # Verificar si la columna es de texto (object) antes de aplicar la limpieza
    if df[columna].dtype == 'object':
        # 1. Quitar espacios al inicio y final (.str.strip())
        # 2. Convertir a minúsculas (.str.lower())
        df[columna] = df[columna].str.strip().str.lower()
    return df

# Función 4: Limpieza específica (CORREGIDA con verificación de tipo)
def limpieza_especifica(df, columna):
    """Asegura que los estados de publicación estén uniformes (Ej. todo en mayúsculas)."""
    # Verificar si la columna es de texto (object) antes de aplicar la limpieza
    if df[columna].dtype == 'object':
        # Convierte a MAYÚSCULAS y quita espacios
        df[columna] = df[columna].str.upper().str.strip()
    return df