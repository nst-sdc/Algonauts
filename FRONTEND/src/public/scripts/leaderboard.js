function createActivityGrid(activities) {
  const td = document.createElement("td");
  const grid = document.createElement("div");
  grid.className = "activity-grid";
  activities.forEach((active) => {
    const cell = document.createElement("div");
    if (active) {
      cell.className = "active";
    }
    grid.appendChild(cell);
  });
  td.appendChild(grid);
  return td;
}

const calculateStreak = (ProgressMatrixes, platformName) =>{
  const dailyActivities = {};
  if (platformName && platformName != 'algonauts') {
    const activities = ProgressMatrixes[platformName].DailyUserActivity;
    for (const date in activities) {
      dailyActivities[date] =
        (dailyActivities[date] || 0) + activities[date].total;
    }
  } else {
    for (const platform in ProgressMatrixes) {
      const activities = ProgressMatrixes[platform].DailyUserActivity;
      for (const date in activities) {
        dailyActivities[date] =
          (dailyActivities[date] || 0) + activities[date].total;
      }
    }
  }
  const sortedDates = Object.keys(dailyActivities).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  let streak = 0;

  for (const date of sortedDates) {
    if (dailyActivities[date] > 0) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}
const getActivityArray = (progressMatrix, platformName, activities) => {
  if (!activities) activities = new Array(7).fill(false);
  if (!platformNames.includes(platformName)) {
    console.error(`Skipping ${platformName}: Invalid data.`);
    return activities.reverse();
  }

  const platformData = progressMatrix[platformName];

  if (!platformData || !platformData.DailyUserActivity) {
    console.warn(`Skipping ${platformName}: Invalid data.`);
    return;
  }

  const dailyActivity = platformData.DailyUserActivity;

  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateString = getFormatedDate(date);
    activities[i] = activities[i] || dailyActivity?.[dateString]?.total > 0;
  }
  return activities.reverse();
};

function getActivities(progressMatrix, orderBy) {
  if (orderBy == "algonauts") {
    const activities = new Array(7).fill(false);
    for (
      let platformIndex = 0;
      platformIndex < platformNames.length;
      platformIndex++
    ) {
      const orderBy = platformNames[platformIndex];
      getActivityArray(progressMatrix, orderBy, activities.reverse());
    }
    return activities;
  } else {
    return getActivityArray(progressMatrix, orderBy);
  }
}

function calculateTotal(ProgressMatrixes) {
  const platformNames = Object.keys(ProgressMatrixes);
  let total = 0;
  for (
    let platformIndex = 0;
    platformIndex < platformNames.length;
    platformIndex++
  ) {
    const platformName = platformNames[platformIndex];
    const platformData = ProgressMatrixes[platformName];

    total += platformData?.aggregatedSolveCounts?.total || 0;
  }
  return total;
}

function insertData(data, orderBy) {
  const tableBody = document.querySelector("tbody");
  tableBody.innerHTML = "";

  data.forEach((ele, index) => {
    const row = document.createElement("tr");
    row.innerHTML += `<td>#${index + 1}</td>`;
    row.innerHTML += `<td>${ele.name}</td>`;

    const activities = getActivities(ele.ProgressMatrixes, orderBy);
    const activityGrid = createActivityGrid(activities);
    row.appendChild(activityGrid);

    row.innerHTML += `<td>${calculateStreak(ele.ProgressMatrixes,orderBy)}</td>`;
    row.innerHTML += `<td>${orderBy != "algonauts" ? ele?.ProgressMatrixes?.[orderBy]?.aggregatedSolveCounts?.total || "RNF" : calculateTotal(ele.ProgressMatrixes)}</td>`;

    row.innerHTML += `<td>${ele?.ProgressMatrixes?.[orderBy] ? ele?.ProgressMatrixes?.[orderBy]?.score : ele.score}</td>`;

    tableBody.appendChild(row);
  });
}

const dropdown = document.getElementById("dropdown");

dropdown.addEventListener("change", async (event) => {
  let url = `/leaderboard/getuserlist`;
  if (event.target.value != "algonauts" && event.target.value) {
    url += `?sortBy=${event.target.value}`;
  }

  insertData(await sendFetchRequest(url), event.target.value);
});

(async () => {
  insertData(
    await sendFetchRequest(`/leaderboard/getuserlist`),
    dropdown.value
  );
})();
