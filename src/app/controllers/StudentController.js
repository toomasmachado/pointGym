import * as yup from 'yup';
import Student from '../models/Student';

class StudentController {
  async store(req, res) {
    const schema = yup.object().shape({
      name: yup.string().required(),
      email: yup
        .string()
        .email()
        .required(),
      age: yup.number().required(),
      weight: yup.number().required(),
      height: yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const studentExists = await Student.findOne({
      where: { email: req.body.email },
    });

    if (studentExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    const { id, name, email, age, weight, height } = await Student.create(
      req.body
    );

    return res.json({
      id,
      name,
      email,
      age,
      weight,
      height,
    });
  }

  async update(req, res) {
    const schema = yup.object().shape({
      name: yup.string(),
      oldemail: yup
        .string()
        .required()
        .email(),
      email: yup.string().email(),
      confirmEmail: yup
        .string()
        .email()
        .when('email', (email, field) =>
          email ? field.required().oneOf([yup.ref('email')]) : field
        ),
      age: yup.number(),
      weight: yup.number(),
      height: yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const student = await Student.findOne({
      where: { email: req.body.oldemail },
    });

    if (!student) {
      return res.status(400).json({ error: 'Email does not exists.' });
    }

    const { id, name, email, age, weight, height } = await student.update(
      req.body
    );

    return res.json({
      id,
      name,
      email,
      age,
      weight,
      height,
    });
  }
}

export default new StudentController();
