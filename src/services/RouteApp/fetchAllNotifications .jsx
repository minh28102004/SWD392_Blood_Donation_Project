import { getRequest } from "@services/API/api";

/**
 * Fetch all notifications of a user, across all pages.
 * @param {string} userId - ID of the user
 * @param {number} pageSize - Number of items per page (optional, default 50)
 * @returns {Promise<Array>} - A full list of notifications
 */
export const fetchAllNotifications = async (userId, pageSize = 100) => {
  const allNotifications = [];
  let page = 1;
  let totalPages = 1;

  try {
    do {
      const query = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });

      const response = await getRequest(
        `/api/Notifications/user/${userId}?${query.toString()}`
      );

      const { data = [], totalPages: tp } = response.data;

      allNotifications.push(...data);
      totalPages = tp;
      page++;
    } while (page <= totalPages);

    return allNotifications;
  } catch (error) {
    console.error("Failed to fetch all notifications:", error);
    return [];
  }
};
