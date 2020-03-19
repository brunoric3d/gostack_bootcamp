/* import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt'; */
import Mail from '../../lib/Mail';

class ShipmentInfoEmail {
  get key() {
    return 'cancellation';
  }

  async handle({ data }) {
    const { delivery, deliveryman } = data;

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'Encomenda cancelada',
      template: 'shipmentinfo',
      context: {
        name: deliveryman.name,
        product: delivery.product,
      },
    });
  }
}

export default new ShipmentInfoEmail();
