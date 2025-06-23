import db from "../../models/index.js";
const { User, sequelize } = db;

export const createUser = async (data) => await User.create(data);

export const findUser = async (where) => await User.findOne({ where });

export const updateUser = async (data, where) =>
  await User.update(data, { where });

export const totalUser = async ({ search, role, user_id }) => {
  let where = `WHERE role=:role AND u.id !=:id`;
  const replacement = { role: role, id: user_id };

  if (search?.length) {
    where += ` AND u.name LIKE :search`;
    replacement.search = `%${search}%`;
  }

  const query = await sequelize.query(
    `SELECT COUNT(DISTINCT u.id) AS count
     FROM users u
     ${where}`,
    {
      type: sequelize.QueryTypes.SELECT,
      replacements: replacement,
    }
  );
  return query[0].count;
};

export const findAllUser = async ({ page, limit, search, role, user_id }) => {
  let where = `WHERE role=:role AND u.id !=:id`;
  const replacement = { role: role, id: user_id };

  if (search?.length) {
    where += ` AND (u.name LIKE :search OR u.email LIKE :search) `;
    replacement.search = `%${search}%`;
  }

  limit = parseInt(limit) || 15;
  const offset = page ? ((parseInt(page) || 1) - 1) * limit : 0;

  const query = await sequelize.query(
    `SELECT u.id, u.name, u.email, u.profile_pic
    FROM users u
    ${where}
    ORDER BY u.created_at DESC
    LIMIT :limit OFFSET :offset`,
    {
      type: sequelize.QueryTypes.SELECT,
      replacements: { ...replacement, limit, offset, role },
    }
  );

  return query;
};
