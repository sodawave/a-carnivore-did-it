# Ha sido un carnívoro

Juego de deducción lógica para escritorio. Una ronda de animales habla; algunas frases son mentira; el dosier fija cuántos mintieron y cuántos lo hicieron. Cada expediente tiene **una sola solución**.

Inspirado en las reglas y el tipo de puzzle de *A Carnivore Did It!* (Horrible Guild). Sospechosos, frases, casos, arte y marca son originales. No es un producto oficial.

## Cómo jugar

- **Tutorial** — tres sospechosos, una mentira. El razonamiento está guiado.
- **Caso abierto** — eliges dosier (1–12) y uno de 20 expedientes. Las mejores estrellas se guardan en el navegador.
- **Campaña** — ocho dosieres seguidos, dos insignias para un fallo, rango de detective al cierre.

En la mesa: marca hipótesis en el cuaderno, acusa a los culpables. El cronómetro reparte 3, 2 o 1 estrella.

## Desarrollo

```bash
npm install
npm test
npm run dev
```

El servidor queda en [http://127.0.0.1:43127](http://127.0.0.1:43127).

## Stack

Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, Vitest. Sin autenticación ni base de datos: el progreso vive en `localStorage`.

## Motor

`src/lib/game/` enumera asignaciones `{culpable, miente}` y solo entrega un caso si hay exactamente una que cumple el dosier y las frases. Culpa y honestidad son independientes. «Un herbívoro lo hizo» es cierto si *al menos un* culpable lo es. Los vecinos son los del círculo.
