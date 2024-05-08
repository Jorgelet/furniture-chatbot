export const INTENTION_PROMPT = `
Analiza el historial de conversación para determinar las intenciones del cliente en un contexto de servicio de ventas de muebles.

#### Historial de conversación:
------------
{history} 
------------

Tu tarea es identificar si el cliente está interesado en obtener más información sobre nuestros servicios y productos, o si tiene la intención de realizar una compra.

### Criterios para clasificar las intenciones del cliente:
Si el cliente muestra interés en conocer más sobre nuestros servicios o los muebles que vendemos, clasifícalo como "CONVERSAR".
Si el cliente muestra interés en conocer el precio de un mueble o cómo realizar una compra, clasifícalo como "ORDENAR".

### ACCIONES POSIBLES:
-ORDENAR: Si el cliente muestra intención de realizar una compra.
-CONVERSAR: Si el cliente muestra interés en obtener más información o simplemente está saludando.

### RESPUESTA IDEAL (ORDENAR|CONVERSAR)`