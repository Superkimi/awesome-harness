export function videoEntries(projects, chapterDefs) {
  return projects.flatMap((project) => [
    {
      id: `${project.slug}-analysis`,
      project: project.slug,
      kind: "analysis",
      chapter: null,
      language: "zh",
      title: `${project.name} · 技术分析总览`,
      sourceCommit: project.commit,
      mp4: `videos/${project.slug}/analysis.mp4`,
      srt: `videos/${project.slug}/analysis.srt`,
      status: "planned"
    },
    ...chapterDefs.map((chapter) => ({
      id: `${project.slug}-ch${chapter.number}-${chapter.id}`,
      project: project.slug,
      kind: "chapter",
      chapter: chapter.id,
      language: "zh",
      title: `${project.name} · M${chapter.number} · ${chapter.title.zh}`,
      sourceCommit: project.commit,
      mp4: `videos/${project.slug}/ch${chapter.number}-${chapter.id}.mp4`,
      srt: `videos/${project.slug}/ch${chapter.number}-${chapter.id}.srt`,
      status: "planned"
    }))
  ]);
}
