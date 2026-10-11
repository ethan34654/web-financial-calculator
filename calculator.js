const calculators = {
loan:{number:"001",title:"Loan & Mortgage Calculator",description:"Estimate a fixed-rate loan payment, total repayment, and total interest.",fields:[
{id:"principal",label:"Loan amount ($)",type:"number",min:1,value:250000,step:0.01},
{id:"rate",label:"Annual interest rate (%)",type:"number",min:0,value:5.5,step:0.01},
{id:"years",label:"Loan term (years)",type:"number",min:1,value:25,step:0.5}],
calculate:v=>{const n=Math.round(v.years*12),r=v.rate/1200,p=v.principal;const m=r===0?p/n:p*r/(1-Math.pow(1+r,-n));return [["Monthly payment",money(m)],["Total amount repaid",money(m*n)],["Total interest",money(m*n-p)],["Number of payments",n.toLocaleString()]]}},
compound:{number:"002",title:"Compound Interest Calculator",description:"Estimate how an initial deposit grows with compound interest and monthly contributions.",fields:[
{id:"initial",label:"Initial deposit ($)",type:"number",min:0,value:1000},
{id:"monthly",label:"Monthly contribution ($)",type:"number",min:0,value:100,step:10},
{id:"rate",label:"Annual return (%)",type:"number",min:0,value:5,step:0.1},
{id:"years",label:"Years invested",type:"number",min:1,value:10}],
calculate:v=>{let bal=v.initial;const r=v.rate/1200,n=Math.round(v.years*12);for(let i=0;i<n;i++)bal=bal*(1+r)+v.monthly;const paid=v.initial+v.monthly*n;return [["Future value",money(bal)],["Your contributions",money(paid)],["Estimated growth",money(bal-paid)],["Time period",`${v.years} years`]]}},
retirement:{number:"003",title:"Retirement Savings Calculator",description:"Project your retirement savings from current savings, monthly contributions, and an assumed return.",fields:[
{id:"current",label:"Current retirement savings ($)",type:"number",min:0,value:15000},
{id:"monthly",label:"Monthly contribution ($)",type:"number",min:0,value:300},
{id:"rate",label:"Assumed annual return (%)",type:"number",min:0,value:5,step:0.1},
{id:"years",label:"Years until retirement",type:"number",min:1,value:30}],
calculate:v=>{let bal=v.current;const r=v.rate/1200,n=Math.round(v.years*12);for(let i=0;i<n;i++)bal=bal*(1+r)+v.monthly;const paid=v.current+v.monthly*n;return [["Projected retirement savings",money(bal)],["Current savings + contributions",money(paid)],["Estimated investment growth",money(bal-paid)],["Years invested",v.years]]}},
budget:{number:"004",title:"Monthly Budget Planner",description:"Add your monthly income and expenses to see how much remains.",fields:[
{id:"income",label:"Monthly take-home income ($)",type:"number",min:0,value:3500},
{id:"housing",label:"Housing ($)",type:"number",min:0,value:1200},
{id:"utilities",label:"Utilities & phone ($)",type:"number",min:0,value:180},
{id:"food",label:"Food & groceries ($)",type:"number",min:0,value:400},
{id:"transport",label:"Transportation ($)",type:"number",min:0,value:250},
{id:"other",label:"Other expenses ($)",type:"number",min:0,value:300}],
calculate:v=>{const exp=v.housing+v.utilities+v.food+v.transport+v.other;const left=v.income-exp;return [["Total monthly income",money(v.income)],["Total monthly expenses",money(exp)],["Money remaining",money(left)],["Share of income remaining",pct(v.income?left/v.income*100:0)]]}},
currency:{number:"005",title:"Currency Converter",description:"Enter the exchange rate you want to use. For example, if 1 USD = 1.36 CAD, enter 1.36.",fields:[
{id:"amount",label:"Amount to convert",type:"number",min:0,value:100},
{id:"from",label:"From currency",type:"text",value:"USD"},
{id:"to",label:"To currency",type:"text",value:"CAD"},
{id:"rate",label:"Rate: 1 unit of FROM = ? units of TO",type:"number",min:0.000001,value:1.36,step:0.0001}],
calculate:v=>[[`Amount in ${v.from.toUpperCase()}`,`${Number(v.amount).toLocaleString(undefined,{maximumFractionDigits:4})} ${v.from.toUpperCase()}`],[`Converted amount in ${v.to.toUpperCase()}`,`${(v.amount*v.rate).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})} ${v.to.toUpperCase()}`],["Exchange rate",`1 ${v.from.toUpperCase()} = ${v.rate} ${v.to.toUpperCase()}`]]},
debt:{number:"006",title:"Debt Payoff Calculator",description:"Estimate how long one debt takes to pay off with a fixed monthly payment. This version models one balance.",fields:[
{id:"balance",label:"Current debt balance ($)",type:"number",min:0.01,value:8000},
{id:"rate",label:"Annual interest rate (%)",type:"number",min:0,value:19.99,step:0.01},
{id:"payment",label:"Monthly payment ($)",type:"number",min:0.01,value:300}],
calculate:v=>{let b=v.balance,totalInt=0,months=0;const r=v.rate/1200;if(r>0&&v.payment<=b*r)throw Error("Your monthly payment must be greater than the first month's interest, or the balance will not decrease.");while(b>0.005&&months<1200){let interest=b*r;totalInt+=interest;b+=interest;const pay=Math.min(v.payment,b);b-=pay;months++;}if(months>=1200)throw Error("This debt could not be paid off within 100 years at that payment amount.");return [["Time to pay off",`${Math.floor(months/12)} years, ${months%12} months`],["Number of payments",months],["Total interest",money(totalInt)],["Total paid",money(v.balance+totalInt)]]}},
tax:{number:"007",title:"Income Tax Estimator",description:"A simple estimate based on your chosen effective tax rate. This is not a bracket-by-bracket tax return calculator.",fields:[
{id:"income",label:"Annual taxable income ($)",type:"number",min:0,value:60000},
{id:"rate",label:"Estimated effective tax rate (%)",type:"number",min:0,max:100,value:20,step:0.1}],
calculate:v=>{const tax=v.income*v.rate/100;return [["Estimated tax",money(tax)],["Income after estimated tax",money(v.income-tax)],["Effective rate used",pct(v.rate)],["Taxable income entered",money(v.income)]]}},
networth:{number:"008",title:"Net Worth Tracker",description:"Enter your assets and liabilities to estimate your current net worth.",fields:[
{id:"cash",label:"Cash & savings ($)",type:"number",min:0,value:5000},
{id:"investments",label:"Investments ($)",type:"number",min:0,value:12000},
{id:"property",label:"Property & other assets ($)",type:"number",min:0,value:0},
{id:"mortgage",label:"Mortgage ($)",type:"number",min:0,value:0},
{id:"loans",label:"Loans & credit cards ($)",type:"number",min:0,value:1500},
{id:"otherdebt",label:"Other liabilities ($)",type:"number",min:0,value:0}],
calculate:v=>{const assets=v.cash+v.investments+v.property,liabs=v.mortgage+v.loans+v.otherdebt;return [["Total assets",money(assets)],["Total liabilities",money(liabs)],["Net worth",money(assets-liabs)]]}},
savings:{number:"009",title:"Savings Goal Calculator",description:"Estimate the monthly deposit needed to reach a savings target by your deadline.",fields:[
{id:"current",label:"Current savings ($)",type:"number",min:0,value:1000},
{id:"target",label:"Savings target ($)",type:"number",min:0.01,value:10000},
{id:"rate",label:"Annual interest rate (%)",type:"number",min:0,value:3,step:0.1},
{id:"months",label:"Months until target date",type:"number",min:1,value:24}],
calculate:v=>{const r=v.rate/1200,n=Math.round(v.months);let future=v.current*Math.pow(1+r,n);let contribution;if(v.target<=future)contribution=0;else if(r===0)contribution=(v.target-v.current)/n;else contribution=(v.target-v.current*Math.pow(1+r,n))*r/(Math.pow(1+r,n)-1);return [["Monthly contribution needed",money(Math.max(0,contribution))],["Current savings",money(v.current)],["Target amount",money(v.target)],["Time available",`${n} months`],["Note",v.target<=future?"Your current savings may already reach the target under this assumption.":"Assumes deposits at the end of each month."]]}},
breakeven:{number:"010",title:"Break-Even Point Calculator",description:"Calculate the number of units and sales revenue required to cover fixed costs.",fields:[
{id:"fixed",label:"Total fixed costs ($)",type:"number",min:0,value:10000},
{id:"price",label:"Selling price per unit ($)",type:"number",min:0.01,value:50,step:0.01},
{id:"variable",label:"Variable cost per unit ($)",type:"number",min:0,value:20,step:0.01}],
calculate:v=>{const margin=v.price-v.variable;if(margin<=0)throw Error("Selling price must be greater than variable cost per unit to break even.");const units=Math.ceil(v.fixed/margin);return [["Contribution margin per unit",money(margin)],["Break-even units",units.toLocaleString()],["Break-even sales revenue",money(units*v.price)],["Break-even calculation",`${v.fixed} ÷ ${money(margin)} = ${v.fixed/margin} units, rounded up`]]}}
};
function money(n){return new Intl.NumberFormat("en-CA",{style:"currency",currency:"CAD",maximumFractionDigits:2}).format(n)}
function pct(n){return `${Number(n).toFixed(2)}%`}
const params=new URLSearchParams(location.search);const type=params.get("type")||"loan";const calc=calculators[type]||calculators.loan;
document.title=`${calc.title} — Financial Calculator`;document.getElementById("number").textContent=`Calculator ${calc.number}`;document.getElementById("title").textContent=calc.title;document.getElementById("description").textContent=calc.description;
const fields=document.getElementById("fields");
calc.fields.forEach(f=>{const wrap=document.createElement("div");wrap.className="field";const label=document.createElement("label");label.htmlFor=f.id;label.textContent=f.label;const input=document.createElement("input");input.id=f.id;input.name=f.id;input.type=f.type;input.value=f.value;if(f.min!==undefined)input.min=f.min;if(f.max!==undefined)input.max=f.max;if(f.step!==undefined)input.step=f.step;if(f.type==="number")input.required=true;wrap.append(label,input);fields.append(wrap)});
document.getElementById("calc-form").addEventListener("submit",e=>{e.preventDefault();const values={};for(const f of calc.fields){const el=document.getElementById(f.id);if(f.type==="number"){const n=Number(el.value);if(el.value.trim()===""||!Number.isFinite(n)||(f.min!==undefined&&n<f.min)||(f.max!==undefined&&n>f.max)){el.focus();showError(`Please enter a valid value for "${f.label}".`);return}values[f.id]=n}else{values[f.id]=el.value.trim()||"Currency"}}
try{const rows=calc.calculate(values);const container=document.getElementById("result-content");container.className="result-list";container.replaceChildren();rows.forEach(([label,value],i)=>{const row=document.createElement("div");row.className="result-row";const name=document.createElement("span");name.textContent=label;const val=document.createElement("strong");val.textContent=value;row.append(name,val);container.append(row)});}catch(err){showError(err.message)}});
function showError(message){const container=document.getElementById("result-content");container.className="error";container.textContent=message}
