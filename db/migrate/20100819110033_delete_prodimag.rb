class DeleteProdimag < ActiveRecord::Migration
  def self.up
drop_table :prodimags
  end

end
