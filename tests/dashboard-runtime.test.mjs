import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import test from 'node:test';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const script = html.match(/<script id="reference-layout-final-script">([\s\S]*?)<\/script>/)[1];
function dashboard(records) {
  const state = {
    students: [{id:1,name:'Học sinh thử A',points:2},{id:2,name:'Học sinh thử B',points:1}],
    groups: [], attendanceRecords: {'2026-09-06': records},
    timetable: {currentWeek:1,weeks:[{id:1,name:'Tuần cũ',startDate:'2026-08-03'},{id:5,name:'Tuần hiện tại',startDate:'2026-08-31'}]}
  };
  const context = vm.createContext({
    state, window:{}, document:{addEventListener(){}}, console,
    getTodayString:()=> '2026-09-06', tkbNormalizeTimetable(){},
    tkbDetectCurrentWeek:()=>5, tkbGetDayMeta:()=>[], getAvatarImg:()=>'',
  });
  vm.runInContext(script,context);
  return {markup:context.window.renderViewTongQuan(),state};
}
test('empty attendance stays unknown and never displays 100% attendance',()=>{
  const {markup}=dashboard({});
  assert.match(markup,/Chưa điểm danh/);
  assert.match(markup,/>0\/2</);
  assert.doesNotMatch(markup,/100%/);
});
test('partial attendance displays progress instead of a completed rate',()=>{
  const {markup}=dashboard({1:'present'});
  assert.match(markup,/1\/2 đã ghi/);
  assert.match(markup,/Đang thực hiện/);
  assert.doesNotMatch(markup,/50%/);
});
test('completed attendance counts late arrivals and excludes absences',()=>{
  assert.match(dashboard({1:'late',2:'excused'}).markup,/50%/);
  assert.match(dashboard({1:'present',2:'late'}).markup,/100%/);
});
test('current dashboard week does not overwrite the editor selection',()=>{
  const {markup,state}=dashboard({});
  assert.match(markup,/Tuần hiện tại/);
  assert.doesNotMatch(markup,/Tuần cũ/);
  assert.equal(state.timetable.currentWeek,1);
});
