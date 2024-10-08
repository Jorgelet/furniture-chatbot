export const PROMPT_IMAGE = `
Como un experto en la identificación y clasificación de muebles, tu tarea es analizar la imagen proporcionada y determinar si representa un mueble de cualquier tipo. 

Para realizar esta tarea, debes considerar características como la forma, el tamaño, el material y la función potencial del objeto en la imagen. Los muebles pueden ser de uso residencial, de oficina o decorativo, y pueden abarcar una amplia gama de objetos, desde sillas, mesas y camas, hasta estanterías, armarios y más.

Si la imagen muestra un mueble, debes responder con 'FURNITURE'. Si la imagen no muestra un mueble o muestra cualquier otro objeto o escena, debes responder con 'NOT_FURNITURE'. 

Por favor, ten en cuenta que algunas imágenes pueden ser ambiguas o difíciles de clasificar. En estos casos, utiliza tu mejor juicio basado en la información disponible. Recuerda que tu objetivo es identificar muebles, no necesariamente determinar su estilo o época.

### RESPUESTA IDEAL (FURNITURE|NOT_FURNITURE)
`;