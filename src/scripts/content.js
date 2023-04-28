const body = document.body;

if (body.firstChild) {
  fetch("https://www.githubstatus.com/api/v2/summary.json")
    .then((response) => response.json())
    .then((summary) => {
      const div = document.createElement("div");
      div.style.width = "100%";
      div.style.paddingLeft = "1rem";
      let bgColor = "inherit";
      let text = "";
      const dateFormatter = new Intl.DateTimeFormat("en-US", {
        dateStyle: "short",
        timeStyle: "short",
      });

      if (summary.status.indicator == "none") {
        const ua = new Date(summary.page.updated_at);
        const fts = dateFormatter.format(ua);
        text = `Github is all good since ${fts}.`;
        bgColor = "darkgreen";
      } else {
        let statuses = [];
        let statusesToShow = [];

        if (summary.components) {
          statuses = summary.components.map((c) => {
            return { name: c.name, status: c.status, updated: c.updated_at };
          });
          statusesToShow = statuses.filter((s) => s.status != "operational");
        }
        console.log(statuses);
        console.log(statusesToShow);

        if (statusesToShow.length) {
          statusesToShow.forEach((status, i) => {
            const updated_at = new Date(status.updated);
            const formattedTime = dateFormatter.format(updated_at);
            text = text.concat(
              `${i > 0 ? " " : ""}${status.name}: ${statusFriendlyName(
                status.status
              )} ${formattedTime}${i != statusesToShow.length - 1 ? " |" : " "}`
            );
          });
        } else {
          text = "No information.";
        }

        bgColor = "darkred";
        if (summary.status.indicator == "minor") bgColor = "orangered";
        // if (summary.status.indicator == "major") {}
        // if (summary.status.indicator == "critical") {}

        const linkToGHS = document.createElement("a");
        linkToGHS.href = "https://githubstatus.com";
        linkToGHS.target = "_blank";
        linkToGHS.textContent = "more...";
        div.appendChild(linkToGHS);
      }

      div.textContent = text;
      div.style.backgroundColor = bgColor;

      document.body.insertBefore(div, document.body.firstChild);
    });
}

function statusFriendlyName(input) {
  switch (input) {
    case "degraded_performance":
      return "Degraded";
    case "partial_outage":
      return "Partial Outage";
    case "major_outage":
      return "Major Outage";
    default:
      return "Operational";
  }
}
