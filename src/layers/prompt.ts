export const INTENTION_PROMPT = `
Como experto con mas de 15 años de experiencia en análisis de interacciones de clientes en un contexto de ventas de muebles, tu tarea es examinar el historial de conversación y determinar el estado actual de la interacción.

#### Historial de conversación:
------------
{history} 
------------

Tu objetivo es identificar la intención del cliente basándote en su interacción con el bot.

### Criterios para identificar el estado de la conversación:
- Si el cliente ha mostrado un interés significativo en un mueble específico, ha preguntado sobre cómo comprar un mueble específico o ha indagado sobre el proceso de compra, clasifícalo como "ORDENAR".
- Si el cliente ha mencionado que no desea comprar nada, que ya no quiere comprar o que solo estaba preguntando sobre precios y no tiene intención de comprar, y el bot o vendedor ha malinterpretado la intención del cliente, clasifícalo como "CANCELAR".
- Si el cliente está en cualquier otra etapa de la conversación, ya sea mostrando interés en los productos, preguntando sobre los productos, enviando cualquier clase de archivo o documento o simplemente saludando, o si las intenciones del cliente no son claras, clasifícalo como "CONVERSAR".

### ACCIONES POSIBLES:
-ORDENAR: Si el cliente ha mostrado un interés significativo en un mueble específico, ha preguntado sobre cómo comprar un mueble específico o ha indagado sobre el proceso de compra.
-CANCELAR: Si el cliente ha mencionado que no desea comprar nada, que ya no quiere comprar o que solo estaba preguntando sobre precios y no tiene intención de comprar, y el bot o vendedor ha malinterpretado la intención del cliente.
-CONVERSAR: Si el cliente está en cualquier otra etapa de la conversación, o si las intenciones del cliente no son claras.

### RESPUESTA IDEAL (ORDENAR|CANCELAR|CONVERSAR)`



/* 
`
Analiza el historial de conversación para determinar las intenciones del cliente en un contexto de servicio de ventas de muebles.

#### Historial de conversación:
------------
{history} 
------------

Tu tarea es identificar mediante el historial de conversación si el cliente ha avanzado en el proceso de compra y el bot ha solicitado sus datos personales para finalizar la transacción, o si el cliente aún está en una etapa de conversación.
Si el bot aun no ha solicitado los datos personales del cliente, clasifícalo como "CONVERSAR".

### Criterios para clasificar las intenciones del cliente:
Si el bot ha solicitado al cliente que proporcione sus datos personales para finalizar la compra de un mueble específico, clasifícalo como "ORDENAR".
Si el cliente está en cualquier otra etapa de la conversación, ya sea mostrando interés en los productos, preguntando sobre los productos o simplemente saludando, clasifícalo como "CONVERSAR".

### ACCIONES POSIBLES:
-ORDENAR: Si el bot ha solicitado al cliente que proporcione sus datos personales para finalizar la compra de un mueble específico.
-CONVERSAR: Si el cliente está en cualquier otra etapa de la conversación.

### RESPUESTA IDEAL (ORDENAR|CONVERSAR)`
**/
