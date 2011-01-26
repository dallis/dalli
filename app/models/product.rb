class Product < ActiveRecord::Base
  has_attached_file :photo, :styles => { :small => "200x250>" } 
  validates_attachment_presence :photo
  validates_attachment_size :photo, :less_than => 5.megabytes
  validates_attachment_content_type :photo, :content_type => ['image/jpeg', 'image/pjpeg','image/png','image/x-png','image/gif']
  attr_accessible :category_id,:sixty, :typ, :price, :sklad, :shortd, :title,:photo, :hundredzav, :fortyzav, :ninety, :artukyl, :astma, :eighteenzav, :forty, :twentyzav, :alerg, :thirty, :twenty, :ukrtitle, :seventyzav, :description
  belongs_to :category
  
#  def self.search(page)#search, page)
#  paginate :per_page => 5, :page => page
#           :conditions => ['title like ?', "%#{search}%"],
#           :order => 'title'
#  end
end
