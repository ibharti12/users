export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },

      password: {
        type: DataTypes.STRING(255),
      },

      profile_pic: {
        type: DataTypes.STRING(255),
      },
      is_verified: {
        type: DataTypes.BOOLEAN(),
      },
      client_id: {
        type: DataTypes.STRING(255),
      },
      role: {
        type: DataTypes.ENUM("0", "1"),
        defaultValue: "1",
        comment: "0: admin, 1: user",
      },
    },
    {
      tablename: "users",
      timestamps: true,
      underscored: true,
    }
  );

  return User;
};
