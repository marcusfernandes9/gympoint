import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';

class NewEnrollmentMail {
  get key() {
    return 'NewEnrollmentMail';
  }

  async handle({ data }) {
    const { enrollment } = data;

    await NewEnrollmentMail.sendMail({
      to: `${enrollment.student.name} <${enrollment.student.email}>`,
      subject: 'Congratulations, you are now enrolled',
      template: 'newEnrollment',
      context: {
        student: enrollment.student.name,
        start_date: format(
          parseISO(enrollment.start_date),
          "'Date de início:' dd'/'MM'/'YYYY",
          {
            locale: pt,
          }
        ),
        end_date: format(
          parseISO(enrollment.end_date),
          "'Date de início:' dd'/'MM'/'YYYY",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new NewEnrollmentMail();
