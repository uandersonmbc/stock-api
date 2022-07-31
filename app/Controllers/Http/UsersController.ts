import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import User from 'App/Models/User';

export default class UsersController {
  public async index() {
    return 'Hello World';
  }

  public async store({ request, response }: HttpContextContract) {
    const newUserSchema = schema.create({
      name: schema.string({ trim: true }, [rules.maxLength(255), rules.required()]),
      email: schema.string({ trim: true }, [
        rules.unique({ table: 'users', column: 'email' }),
        rules.email(),
        rules.required(),
      ]),
      password: schema.string({ trim: true }, [
        rules.confirmed('password_confirmation'),
        rules.minLength(6),
      ]),
    });
    const payload = await request.validate({ schema: newUserSchema });
    const user = await User.create(payload);
    return response.status(201).json(user);
  }

  public async show({ params }: HttpContextContract) {
    return params.id;
  }

  public async update({ params, request, response }: HttpContextContract) {
    const data = request.only(['name', 'email', 'password', 'password_confirmation']);
    return response.status(200).json({ id: params.id, data });
  }

  public async destroy({ params }: HttpContextContract) {
    return params.id;
  }

  public async login({ request, auth, response }: HttpContextContract) {
    const loginSchema = schema.create({
      email: schema.string({ trim: true }, [rules.email(), rules.required()]),
      password: schema.string({ trim: true }, [rules.required()]),
    });

    try {
      const { email, password } = await request.validate({ schema: loginSchema });
      console.log(request.all());
      const token = await auth.use('api').attempt(email, password, {
        info: { ...request.headers(), remote_ip: request.ip() },
      });
      return token;
    } catch (e) {
      return response.status(401).json({ error: 'Unauthorized', message: e.message });
    }
  }

  public async logout({ auth }: HttpContextContract) {
    await auth.logout();
  }
}
