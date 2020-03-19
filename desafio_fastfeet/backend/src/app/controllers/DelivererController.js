import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt';
import { Op } from 'sequelize';
import Delivery from '../models/Delivery';
import User from '../models/User';
import File from '../models/File';

class DelivererController {
  async index(req, res) {
    const { delivered = 'false' } = req.query;

    const deliveries = await Delivery.findAll({
      where: {
        deliveryman_id: req.params.deliverymanId,
        canceled_at: null,
        end_date: delivered === 'true' ? { [Op.ne]: null } : null,
      },
      order: ['id'],
    });

    return res.status(200).json(deliveries);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.date(),
      end_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const { start_date, end_date } = req.body;

    const delivery = await Delivery.findByPk(req.params.deliveryId);

    delivery.canceled_at = new Date();

    await delivery.save();

    const deliveryman = await Deliveryman.findByPk(req.params.deliverymanId);

    await Queue.add(CancellationMail.key, {
      delivery,
      deliveryman,
    });

    /*  const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    const checkAvailability = await Delivery.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (checkAvailability) {
      return res.status(400).json({ error: 'Delivery date is not available' });
    } */

    const delivery = await Delivery.update({
      start_date,
      end_date,
    });

    /* const user = await User.findByPk(req.userId);
    const formattedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM', às' H:mm'h'",
      { locale: pt }
    ); */

    /* await Notification.create({
      content: `Novo agendamento de ${user.name} para ${formattedDate}`,
      user: provider_id,
    }); */

    return res.json(delivery);
  }
}

export default new DelivererController();
