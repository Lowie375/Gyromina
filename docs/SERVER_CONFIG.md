# Server Configuration

Since Gyromina is not connected to a database, making a full configuration suite with expansive configuration and customization options is not feasible.  
However, Gyromina does make use of some clever workarounds within its code to provide support for some basic configuration.

All information below is applicable to Gyromina versions `>=1.2.0`.

## Anti-spam

### `poll`: custom poll option limit

If you would like to restrict who can create long custom polls (polls with 5 or more options) to prevent poll spam, **create a role with "poll" in its name** and the behaviours listed below will take effect.  
**Servers without a "poll" role will be unaffected.**

If a custom poll is created in a server that contains a role with "poll" in its name, Gyromina will check if the user who created the custom poll:

- has a role with "poll" in its name
- has either the `Manage Messages` or `Administrator` permission, or
- is the server owner

If none of the above are true, Gyromina will trim the custom poll's options down to the first 4 provided.
