# JWT Spec for AI interaction

Data:
```
{
   'ident': '########-####-####-####-############'
   /**
    * This is the game identifier provided for the current
    * game. It will be missing when the AI is not part of
    * a game.
    */

   'teamname': '.+'
   /**
    * This is the name for the AI. It is provided on the
    * call to the `/ai/join` endpoint. This field should
    * always be set.
    */
}
```
