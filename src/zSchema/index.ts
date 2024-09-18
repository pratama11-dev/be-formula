import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

export class ZodSchema {
  static ZdefaultGetData = z.object({
    offset: z.number().optional(),
    limit: z.number().optional(),
    search: z.string().optional(),
    id: z.number().optional()
  })

  static ZInviteUser = z.object({
    name: z.string(),
    email: z.string().email('email format is not correct!'),
    password: z.string(),
    id_role: z.number()
  });

  static ZAddEvent = z.object({
    name: z.string(),
    event_date: z.string()
  })

  static ZEditEvent = z.object({
    id_event: z.number(),
    name: z.string(),
    event_date: z.string()
  })

  static convertZodToJsonSchema(schema: any, schemaName: string) {
    const jsonSchema = zodToJsonSchema(schema, schemaName);
    return jsonSchema.definitions?.[schemaName];
  }

  static getAllJsonSchemas() {
    const schemas = Object.keys(ZodSchema)
      .filter((key) => key.startsWith("Z"))
      .map((key) => ({
        schema: ZodSchema[key],
        name: key.slice(1),
      }));

    const jsonSchemas = {};
    for (const { schema, name } of schemas) {
      jsonSchemas["Z" + name] = ZodSchema.convertZodToJsonSchema(schema, name);
    }
    return jsonSchemas;
  }
}
