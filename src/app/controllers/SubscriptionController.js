import * as Yup from 'yup';
import Subscription from '../models/Subscription';

class SubscriptionController {
  async index(req, res) {
    return res.json();
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      type: Yup.string().required(),
      name: Yup.string().required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      res.status(400).json({ error: 'Validation fails' });
    }

    const { type, name, price } = req.body;

    const subscription = await Subscription.create({
      type,
      name,
      price,
    });

    return res.json(subscription);
  }
}

export default new SubscriptionController();
