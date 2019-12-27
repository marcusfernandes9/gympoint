import * as Yup from 'yup';
import Subscription from '../models/Subscription';

class SubscriptionController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const subscriptions = await Subscription.findAll({
      where: {
        active: true,
      },
      order: ['title'],
      attributes: ['id', 'title', 'duration', 'price'],
      limit: 10,
      offset: (page - 1) * 20,
    });

    return res.json(subscriptions);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number()
        .positive()
        .required(),
      price: Yup.number()
        .positive()
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      res.status(400).json({ error: 'Validation fails' });
    }

    const { id, title, duration, price, active } = await Subscription.create(
      req.body
    );
    return res.json({
      id,
      title,
      duration,
      price,
      active,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      duration: Yup.number(),
      price: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const subscription = await Subscription.findByPk(req.params.id);

    if (!subscription) {
      return res.status(400).json({ error: 'Subscription not found' });
    }

    const subscriptionExists = await Subscription.findOne({
      where: { title: req.body.title },
    });

    if (subscriptionExists && subscription.title !== req.body.title) {
      return res.status(400).json({ error: 'Subscription already exists' });
    }

    const { id, title, duration, price, active } = await subscription.update(
      req.body
    );

    return res.json({
      id,
      title,
      duration,
      price,
      active,
    });
  }

  async delete(req, res) {
    const subscription = await Subscription.findByPk(req.params.id);
    subscription.active = false;
    await subscription.save();

    return res.json(subscription);
  }
}

export default new SubscriptionController();
