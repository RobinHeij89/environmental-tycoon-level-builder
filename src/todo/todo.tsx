import style from './todo.module.css'
export const Todo = () => {
  return (
    <>
      <ul className={style.list}>
        <li>Add buildings (with even more tiles)</li>
        <li>Remove buildings</li>
        <li>Make sure the roads are connected when possible, different sprites</li>
        <li>Show biome specific assets</li>
        <li><s>Make roads removable, by pressing shift (or something like that)</s></li>
        <li><s>Drag to place tiles (water and grass)</s></li>
        <li><s>Make sure roads are only built on soil</s></li>
        <li><s>Export level</s></li>
        <li><s>Import level</s></li>
        <li><s>Check if we can built a straight road in 2 clicks</s></li>
        <li><s>Make sure the coord system is the same as Unity</s></li>
        <li><s>Fill up with grass automatically</s></li>
        <li><s>Use real assets</s></li>
      </ul>
    </>
  )
}