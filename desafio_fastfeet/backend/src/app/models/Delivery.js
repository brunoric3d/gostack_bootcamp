import Sequelize, { Model } from 'sequelize';

class Delivery extends Model {
  static init(sequelize) {
    super.init(
      {
        recipient_id: Sequelize.NUMBER,
        deliveryman_id: Sequelize.NUMBER,
        signature_id: Sequelize.NUMBER,
        product: Sequelize.STRING,
        canceled_at: Sequelize.DATE,
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
      },
      {
        freezeTableName: true,
        tableName: 'deliveries',
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Recipient, { foreignKey: 'recipient_id' });
    this.belongsTo(models.Deliveryman, { foreignKey: 'deliveryman_id' });
  }
}

export default Delivery;
