import * as Yup from 'yup';
import { startOfDay, parseISO, isBefore, addMonths, format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Subscription from '../models/Subscription';
import Enrollment from '../models/Enrollment';
import Student from '../models/Student';

class EnrollmentController {
  async index(req, res) {
    return res.json();
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      subscription_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { student_id, subscription_id, start_date } = req.body;
    const student = await Student.findOne({
      where: {
        id: student_id,
      },
    });

    if (!student) {
      return res.status(400).json({ error: 'User not exists' });
    }

    const subscription = await Subscription.findOne({
      where: {
        id: subscription_id,
      },
    });

    if (!subscription) {
      return res.status(400).json({ error: 'Subscription not exists' });
    }

    /**
     * Check for past dates
     */
    const startDate = parseISO(start_date);

    if (isBefore(startDate, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    const end_date = addMonths(startDate, subscription.duration);
    // isso pode virar um campo virtual
    const price = subscription.price * subscription.duration;

    const enrollment = await Enrollment.create({
      student_id,
      subscription_id,
      start_date: startDate,
      end_date,
      price,
    });

    /**
     * Notify student about enrollment
     */
    /*
    const user = await User.findByPk(student_id);
    const formattedDate = format(
      startDate,
      "'dia' dd 'de' MMMM, 'ás' H:mm'h'",
      {
        locale: pt,
      }
    );

    // Envio de email
      */
    return res.json(enrollment);
  }

  async update(req, res) {
    return res.json();
  }

  async delete(req, res) {
    return res.json();
  }
}

export default new EnrollmentController();
