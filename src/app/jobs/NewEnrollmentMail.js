import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class NewEnrollmentMail {
  get key() {
    return 'NewEnrollmentMail';
  }

  async handle({ data }) {
    const { studentName, studentEmail, start_date, end_date, price } = data;

    await Mail.sendMail({
      to: `${studentName} <${studentEmail}>`,
      subject: 'Congratulations, you are now enrolled',
      template: 'newEnrollment',
      context: {
        student: studentName,
        price,
        start_date: format(
          parseISO(start_date),
          "'Date de início:' dd'/'MM'/'yyyy",
          {
            locale: pt,
          }
        ),
        end_date: format(
          parseISO(end_date),
          "'Date de início:' dd'/'MM'/'yyyy",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new NewEnrollmentMail();
