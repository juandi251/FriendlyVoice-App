# 🎤 FriendlyVoice-App: Módulo de Análisis de Datos del Semestre

Este proyecto desarrolla un módulo de análisis de datos en Python para la simulación de nuestra red social de voz, FriendlyVoice-App. El objetivo es procesar datos simulados de usuarios y publicaciones para cumplir con los requisitos académicos de preprocesamiento, análisis y gestión de versiones (Git Flow).

## 📊 Estructura del Proyecto

- *data/*: Contiene los archivos de datos relacionales (usuarios.csv, publicaciones.json) con problemas de datos simulados (valores nulos, inconsistencias).
- *src/data-analysis/preprocesamiento.py* (Miembro 1): Módulo con funciones para cargar datos, manejar valores nulos y estandarizar texto.
- *src/data-analysis/analisis.py* (Miembro 3): Script principal que realiza las operaciones de análisis final y agrupación.

## ⚙ Configuración y Ejecución

Para correr el análisis, siga estos pasos:

### 1. Requisitos
Asegúrese de tener *Python* instalado y la librería *Pandas*.

```bash
# Instalar Pandas (Si da error, usar 'py -m pip install pandas')
pip install pandas