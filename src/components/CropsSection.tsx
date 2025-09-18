import React from 'react';

const CropsSection: React.FC = () => {
  return (
    <section id="crops" className="py-5">
      <div className="container">
        <h2 className="section-title text-center">Major Crops in Andhra Pradesh</h2>
        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="crop-card card h-100">
              <img src="https://th.bing.com/th/id/OIP.CfK1a6YbCHTEbxoMx1o25gHaEJ?w=248&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3" className="crop-image card-img-top" alt="Rice" />
              <div className="card-body">
                <h3 className="h5">Rice</h3>
                <p className="card-text">Andhra Pradesh is a major producer of rice, with optimal growing conditions in the coastal regions.</p>
                <div className="d-flex justify-content-between">
                  <small className="text-muted">Season: Kharif & Rabi</small>
                  <small className="text-muted">Yield: 2500-3000 kg/acre</small>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="crop-card card h-100">
              <img src="https://images.pexels.com/photos/9185580/pexels-photo-9185580.jpeg?cs=srgb&dl=pexels-john-bastian-9185580.jpg&fm=jpg" className="crop-image card-img-top" alt="Chillies" />
              <div className="card-body">
                <h3 className="h5">Chillies</h3>
                <p className="card-text">Known for the famous Guntur chillies, Andhra Pradesh is India's largest producer and exporter of red chillies.</p>
                <div className="d-flex justify-content-between">
                  <small className="text-muted">Season: Kharif</small>
                  <small className="text-muted">Yield: 15-20 qtl/acre</small>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="crop-card card h-100">
              <img src="https://th.bing.com/th/id/OIP.80_mudkv2xkSbnQXYwHQKgHaE8?w=276&h=184&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3" className="crop-image card-img-top" alt="Turmeric" />
              <div className="card-body">
                <h3 className="h5">Turmeric</h3>
                <p className="card-text">Andhra Pradesh produces high-quality turmeric with excellent medicinal properties.</p>
                <div className="d-flex justify-content-between">
                  <small className="text-muted">Season: Throughout year</small>
                  <small className="text-muted">Yield: 40-50 tons/acre</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CropsSection;