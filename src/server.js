import http from "http";
import { read, write } from "./utils/FS.js";

const options = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*"
};

http.createServer((req, res) => {
  // ===================================================== GET ======================================================= //
    if (req.method == "GET") {
      // ===================== GET MARKET(S) ================= //
      if(req.url == '/markets') {
        let markets = read('markets.json')
        
        if (markets) {
            res.writeHead(200, options)
            return res.end(JSON.stringify(markets))
        }
        
        if (!markets) {
            res.writeHead(404, options)
            return res.end(JSON.stringify("Market topilmadi"))
        }
      }
      
    let marketUrl2 = req.url.split('/')[2]
    let urlMarket = `/market/${marketUrl2}`;

    if(req.url == urlMarket) {
        const markets = read('markets.json')
        const branches = read('branches.json')
        const products = read('products.json')
        const workers = read('workers.json')
        
        let findMarkets = markets.find(e => {
            if(e.id == marketUrl2){
            let marketBranches = markets.map(e => branches.find(branch => branch.marketId == e.id).marketId == e.id ? branches.find(branch => branch.marketId == e.id) : null)

            
                marketBranches.find(e => {
                let branchProducts = marketBranches.map(branch => products.find(m => m.branchId == branch.id).branchId == branch.id ? products.find(product => product.branchId == e.id) : null)

                let branchWorker = marketBranches.map(e => workers.find(worker => worker.branchId == e.id).branchId == e.id ? workers.find(worker => worker.branchId == e.id) : null)
                
            return (e.workers = branchWorker, e.products = branchProducts)

            })
            
            return (e.branches = marketBranches)
            }
        })

        res.writeHead(200, options)
        return res.end(JSON.stringify(findMarkets))
    }
      // =================== END GET MARKET(S) ================= //


      // ==================== GET BRANCH ======================= //
      const branchId = req.url.split("/")[2]
      const branchUrl = req.url.split("/")[1]

      if(branchUrl == "branch" && branchId) {
        const branches = read("branches.json");

        const foundBranch = branches.find(e => e.id == branchId)

        if(!foundBranch) {
          res.writeHead(400, options);
          res.end(JSON.stringify({ 
            message: "Branch not found"
          }));
        }

        res.writeHead(200, options);
        res.end(JSON.stringify(foundBranch));
        return
      }

      if (req.url == "/branches") {
        const branches = read("branches.json");

        if (branches) {
          res.writeHead(200, options);
          return res.end(JSON.stringify( branches))
        }
        
      }
      // ==================== END GET BRANCH ======================= //
      
      // if(req.url == "/branches") {
      //   const branches = read("branches.json")
  
      //   res.writeHead(200, options)
      //   return res.end(JSON.stringify(branches))
      // }

     // ======================== GET PRODUCT ================== //
      const productsId = req.url.split("/")[2]
      const produtsUrl = req.url.split("/")[1]

      if(produtsUrl == "product" && productsId) {
        const products = read("products.json");

        const foundProducts = products.find(e => e.id == productsId)

        if(!foundProducts) {
          res.writeHead(400, options);
          res.end(JSON.stringify({ 
            message: "Product not found"
          }));
        }

        res.writeHead(200, options);
        res.end(JSON.stringify(foundProducts));
        return
      }

      if (req.url == "/products") {
        const products = read("products.json");

        if (products) {
          res.writeHead(200, options);
          return res.end(JSON.stringify(products))
        }
      }
     // ======================= END GET PRODUCT ==================//

      

         // ================= GET WORKER ================ //
      const workersId = req.url.split("/")[2]
      const workersUrl = req.url.split("/")[1]

      if(workersUrl == "worker" && workersId) {
        const workers = read("workers.json");

        const foundWorkers = workers.find(e => e.id == workersId)

        if(!foundWorkers) {
          res.writeHead(400, options);
          res.end(JSON.stringify({ 
            message: "Worker not found"
          }));
        }

        res.writeHead(200, options);
        res.end(JSON.stringify(foundWorkers));
        return
      }

      if (req.url == "/workers") {
        const workers = read("workers.json");

        if (workers) {
          res.writeHead(200, options);
          return res.end(JSON.stringify( workers))
        }
        
      }
         // ================= END GET WORKER ================ //

      res.writeHead(404,  options)
      res.end(JSON.stringify({
        message: "Not found"
      }))

    }
    // res.end("Sen Get qilmading");


    
    // =========================================================== POST ===================================================================//
    if(req.method == "POST") {

     // ================== MARKET BRANCH =============== //
      if(req.url == "/newMarket") {
        req.on('data', (chunk) => {
          const {name, address} = JSON.parse(chunk)
          const allMarkets = read('markets.json')

          allMarkets.push({ id: allMarkets.at(-1)?.id + 1 || 1, name , address})

          write('markets.json', allMarkets)
          
          res.writeHead(201, options)
          res.end(JSON.stringify({
            message: "Market has been created"
          }))
        })
      }
     // ================= END MARKET BRANCH ============== //



     // ===================  POST BRANCH =============== //
      if(req.url == '/newBranch') {
        req.on('data', (chunk) => {
            const { name, address, marketId} = JSON.parse(chunk)
   
            const allBranches = read('branches.json')
  
            allBranches.push({ id: allBranches.at(-1)?.id + 1 || 1, name, address, marketId })
  
            write('branches.json', allBranches)
  
            
                res.writeHead(201, options)
                res.end(JSON.stringify({
                    message: "Newbranch has been created"
               }))
            
        })
     }
     // =================== END POST BRANCH =============== //



     // ==================== POST PRODUCT ================= //
     if(req.url == "/newProduct") {
      req.on("data", (chunk) => {
        const { title, price, branchId } = JSON.parse(chunk)

        const allProducts = read("products.json")

        allProducts.push( {id: allProducts.at(-1)?.id + 1 || 1, title, price, branchId })

        write('products.json', allProducts)

        res.writeHead(201, options)
        res.end(JSON.stringify({
          message: "Newproduct has been created"
        }))
      })
     }
     // =================== END POST PRODUCT ================= //



     // ===================== POST WORKER ===================== //
     if(req.url == "/newWorker") {
      req.on('data', (chunk) => {
        const {name, salary, branchId} = JSON.parse(chunk)

        const allWorkers = read('products.json')

        allWorkers.push( {id: allWorkers.at(-1)?.id + 1 || 1, name, salary, branchId})

        write('workers.json', allWorkers)

        res.writeHead(201, options)
        res.end(JSON.stringify({
          message: "Newworker has been created"
        }))
      })
     }
     // =================== END POST WORKER ====================== //

    }
// ========================================================= END POST ===================================================================//




// =========================================================== PUT ================================================================== //
    if(req.method == "PUT") {

      // =================== UPDATE MARKET =============== //
      let updateUrl = req.url.split('/')[2]
      if(req.url.split('/')[1] == 'updateMarket' && updateUrl) {
        req.on('data', chunk => {
          const allMarkets = read('markets.json')

          const { address, name } = JSON.parse(chunk)

          const foundMarket = allMarkets.find(e => e.id == updateUrl)

          foundMarket.name = name || foundMarket.name
          foundMarket.address = address || foundMarket.address

          write("markets.json", allMarkets)

          res.writeHead(200, options)
          res.end(JSON.stringify({
            message: "Market has been updated"
          }))
        })
      }
      // ================== END UPDATE MARKET =============== //




      //=================== UPDATE BRANCHE =====================//
        if(req.url.split('/')[1] == 'updateBranch' && updateUrl) {
          req.on('data', chunk => {
            const allBranches = read('branches.json')
  
            const { name, address, marketId } = JSON.parse(chunk)
  
            const foundBranch = allBranches.find(e => e.id == updateUrl)
  
            foundBranch.name = name || foundBranch.name
            foundBranch.address = address || foundBranch.address
            foundBranch.marketId = marketId || foundBranch.marketId
  
            write("branches.json", allBranches)
  
            res.writeHead(200, options)
            res.end(JSON.stringify({
              message: "Branch has been updated"
            }))
          })
        }
      //================== END UPDATE BRANCHE ==================//





        // ==================== UPDATE PRODUCT ==================//
        if(req.url.split('/')[1] == 'updateProduct' && updateUrl) {
          req.on('data', chunk => {
            const allProducts = read('products.json')
  
            const { title, price, branchId } = JSON.parse(chunk)
  
            const foundProduct = allProducts.find(e => e.id == updateUrl)
  
            foundProduct.title = title || foundProduct.title
            foundProduct.price = price || foundProduct.price
            foundProduct.branchId = branchId || foundProduct.branchId
  
            write("products.json", allProducts)
  
            res.writeHead(200, options)
            res.end(JSON.stringify({
              message: "Product has been updated"
            }))
          })
        }
        // ================== END UPDATE PRODUCT =================//




        //======================= UPDATE WORKER ================ //
        if (req.url.split('/')[1] == 'updateWorker' && updateUrl) {
          req.on("data", chunk => {
            const allWorkers = read("workers.json")

            const {name, salary, branchId} = JSON.parse(chunk)

            const foundWorker = allWorkers.find(e => e.id == updateUrl) 

            foundWorker.name = name || foundWorker.name
            foundWorker.salary = salary || foundWorker.salary
            foundWorker.branchId = branchId || foundWorker.branchId

            write('workers.json', allWorkers)

            res.writeHead(200, options) 
            res.end(JSON.stringify({
              message: "Worker has been updated"
            }))
          })
        }
        //===================== END UPDATE WORKER ================ //

  }
  // ============================================================== END PUT =============================================================== //



  // ============================================================ DELETE ============================================================//
    if(req.method == "DELETE") {
    // ==================== DELETE BRANCH =================== //
      const deletMarketId = req.url.split('/')[2]
      const deleteIdMarketUrl = req.url.split('/')[1]
     if(deleteIdMarketUrl == 'deleteMarket' && deletMarketId) {
      const allMarkets = read("markets.json")

      const index = allMarkets.findIndex(e => e.id == deletMarketId)

      allMarkets.splice(index, 1)

      write('markets.json', allMarkets)

      res.writeHead(200, options) 
      res.end(JSON.stringify({
        message: "Market has been deleted"
      }))
     }
    // ================== END DELETE BRANCH ================== //



    // ==================== DELETE BRANCH =================== //
     const deletBranchId = req.url.split('/')[2]
     const deleteIdBranchUrl = req.url.split('/')[1]
     if(deleteIdBranchUrl == 'deleteBranch' && deletBranchId) {
       const allBranches = read("branches.json")
 
       const index = allBranches.findIndex(e => e.id == deletBranchId)
 
       allBranches.splice(index, 1)
 
       write('branches.json', allBranches)
 
       res.writeHead(200, options) 
       res.end(JSON.stringify({
         message: "Branch has been deleted"
       }))
      }
    // ================== END DELETE BRANCH ================== //



    // ==================== DELETE PRODUCT =================== //
    const deletProductId = req.url.split('/')[2]
     const deleteIdProductUrl = req.url.split('/')[1]
     if(deleteIdProductUrl == 'deleteProduct' && deletProductId) {
       const allProducts = read("products.json")
 
       const index = allProducts.findIndex(e => e.id == deletProductId)
 
       allProducts.splice(index, 1)
 
       write('products.json', allProducts)
 
       res.writeHead(200, options) 
       res.end(JSON.stringify({
         message: "Product has been deleted"
       }))
      }
    // ================== END DELETE PRODUCT =================== //



    // ==================== DELETE WORKER =================== //
    const deletWorkerId = req.url.split('/')[2]
     const deleteIdWorkerUrl = req.url.split('/')[1]
     if(deleteIdWorkerUrl == 'deleteWorker' && deletWorkerId) {
       const allWorkers = read("workers.json")
 
       const index = allWorkers.findIndex(e => e.id == deletWorkerId)
 
       allWorkers.splice(index, 1)
 
       write("workers.json", allWorkers)
 
       res.writeHead(200, options) 
       res.end(JSON.stringify({
         message: "Worker has been deleted"
       }))
      }
    // ================== END DELETE WORKER =================== //
     }
  // ============================================================ DELETE ============================================================//

  })
  .listen(9090, console.log(9090)); 



