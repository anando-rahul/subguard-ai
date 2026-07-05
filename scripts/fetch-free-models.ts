fetch("https://openrouter.ai/api/v1/models").then(r => r.json()).then(data => {
  const free = data.data.filter((m: any) => m.id.includes('free'));
  console.log(free.map((m: any) => m.id).join('\n'));
});
